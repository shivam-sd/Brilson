const { getConfig } = require("../config/runTimeConfigLoader");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Cashfree.model");
const UserModel = require("../models/User.model");
const createInvoicePdf = require("../utils/createInvoicePdf");
const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");
const axios = require("axios");




// CREATE CASHFREE ORDER


const createCashfreeOrder = async (req, res) => {

  const config = getConfig();

console.log("Cashfree Config: Create se", config.cashfree);


  try {

    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const data = {

      order_id: `order_${order._id}_${Date.now()}`,
      order_amount: order.totalAmount,
      order_currency: "INR",

      customer_details: {
        customer_id: order.userId.toString(),
        customer_email: order.address?.email,
        customer_phone: order.address?.phone,
        customer_name: order.address?.name
      }

    };

    const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "x-client-id": config.cashfree?.appId || process.env.CASHFREE_APP_ID,
  "x-client-secret": config.cashfree?.secretKey || process.env.CASHFREE_SECRET_KEY,
  "x-api-version": "2022-09-01",
};

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      data,
      { headers }
    );

    const cfOrderId = response.data.order_id;

    const payment = await PaymentModel.create({
      userId: order.userId,
      orderId: order._id,
      cashfreeOrderId: cfOrderId,
      amount: order.totalAmount,
      status: "created"
    });

    res.json({
      paymentSessionId: response.data.payment_session_id,
      cfOrderId: cfOrderId
    });

  } catch (err) {

    console.error("Cashfree create error:", err.response?.data || err);

    res.status(500).json({
      error: "Cashfree payment error"
    });

  }

};




// VERIFY CASHFREE PAYMENT


const verifyCashfreePayment = async (req, res) => {

    const config = getConfig();

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-client-id": config?.cashfree?.appId || process.env.CASHFREE_APP_ID,
    "x-client-secret": config?.cashfree?.secretKey || process.env.CASHFREE_SECRET_KEY,
    "x-api-version": "2022-09-01",
  };


  console.log("Cashfree Config: Verify Se", config.cashfree);

  try {

    const { orderId } = req.body; 

    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      { headers }
    );

    const orderStatus = response.data.order_status;

    if (orderStatus !== "PAID") {
      return res.status(400).json({
        error: "Payment not completed"
      });
    }

    // FIND PAYMENT ENTRY
    const payment = await PaymentModel.findOne({
      cashfreeOrderId: orderId
    });

    if (!payment) {
      return res.status(404).json({
        error: "Payment record not found"
      });
    }

    payment.status = "paid";
    await payment.save();

    // UPDATE MAIN ORDER
    const order = await OrderModel.findByIdAndUpdate(
      payment.orderId,
      { status: "paid" },
      { new: true }
    );

    // UPDATE USER ORDER COUNT
    const user = await UserModel.findById(order.userId);

    if (user) {
      user.totalOrders += 1;
      await user.save();
    }

    res.json({ success: true });

    // =========================
    // BACKGROUND INVOICE
    // =========================

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

      console.log("Invoice generated");

    } catch (invoiceError) {

      console.error("Invoice error:", invoiceError);

    }

  } catch (err) {

    console.error("Verify Cashfree error:", err.response?.data || err);

    res.status(500).json({
      error: "Verification failed"
    });

  }

};



module.exports = {
  createCashfreeOrder,
  verifyCashfreePayment
};