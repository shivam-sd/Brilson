const dotenv = require("dotenv").config();
const crypto = require("crypto");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/PayU.model");
const UserModel = require("../models/User.model");
const createInvoicePdf = require("../utils/createInvoicePdf");
const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");


// CREATE PAYU ORDER
const createPayUOrder = async (req, res) => {
  try {

    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const txnid = "txn_" + Date.now();

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    const firstname = order.address?.name || "Customer";
    const email = order.address?.email;
    const phone = order.address?.phone;

    const productinfo = "Order Payment";

    const hashString =
      `${key}|${txnid}|${order.totalAmount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    await PaymentModel.create({
      userId: order.userId,
      orderId: order._id,
      txnid,
      amount: order.totalAmount,
      status: "created"
    });

    res.json({
      paymentUrl: process.env.PAYU_BASE_URL,
      data: {
        key,
        txnid,
        amount: order.totalAmount,
        productinfo,
        firstname,
        email,
        phone,
        surl: `${process.env.BASE_URL1}/api/payment/payu/verify`,
        furl: `${process.env.BASE_URL1}/api/payment/payu-failure`,
        hash
      }
    });

  } catch (err) {

    console.error("PayU create error", err);

    res.status(500).json({
      error: "PayU payment error"
    });

  }
};



// PAYU SUCCESS VERIFY
const VerifyPayU = async (req, res) => {

  try {

    const { status, txnid } = req.body;

    if (status !== "success") {
      return res.redirect(`${process.env.BASE_URL1}/payment-failed`);
    }

    const payment = await PaymentModel.findOneAndUpdate(
      { txnid },
      { status: "paid" },
      { new: true }
    );

    if (!payment) {
      return res.redirect(`${process.env.BASE_URL1}/payment-failed`);
    }

    const order = await OrderModel.findByIdAndUpdate(
      payment.orderId,
      { status: "paid" },
      { new: true }
    );

    const user = await UserModel.findById(order.userId);

    if (user) {
      user.totalOrders += 1;
      await user.save();
    }

    try {

      const { pdfPath, invoiceNumber } = await createInvoicePdf(order);

      const cloudinaryData = await uploadInvoiceToCloudinary(
        pdfPath,
        invoiceNumber
      );

      order.invoice = {
        number: invoiceNumber,
        pdfUrl: cloudinaryData.pdfUrl,
        cloudinaryId: cloudinaryData.cloudinaryId,
        generatedAt: new Date()
      };

      await order.save();

    } catch (invoiceError) {
      console.error("Invoice error:", invoiceError);
    }

    res.redirect(`${process.env.BASE_URL1}/payment-success`);

  } catch (err) {

    console.error("PayU verify error", err);
    res.redirect(`${process.env.BASE_URL1}/payment-failed`);

  }

};


module.exports = {
  createPayUOrder,
  VerifyPayU
};