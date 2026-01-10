const getRazorpayInstance = require("../config/razorpay");
const { getConfig } = require("../config/runTimeConfigLoader");
const UserModel = require("../models/User.model");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Payment.model");
const crypto = require("crypto");
const distributeMLMCommission = require("../controller/mlmCommission.controller");
const deleteLocalFile = require("../utils/deleteLocalFile");
const createInvoicePdf = require("../utils/createInvoicePdf");
const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");
const distributeReferralReward = require("../utils/distributeReferralReward");



//  CREATE PAYMENT ORDER 

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const razorpay = getRazorpayInstance();

    const amountInPaisa = Math.round(order.totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    await PaymentModel.create({
      userId: order.userId,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      status: "created",
    });

    res.json(razorpayOrder);
  } catch (err) {
    console.error("Create Payment Error:", err);
    res.status(500).json({ error: "Payment error" });
  }
};



//  VERIFY PAYMENT 

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const config = getConfig();

    if (!config?.razorpay?.keySecret) {
      return res.status(500).json({ error: "Razorpay config missing" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payment = await PaymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: "paid" },
      { new: true }
    );

    // respond fast
    res.json({ success: true });

    // ---------------- BACKGROUND JOB ----------------
    try {
      const { pdfPath, invoiceNumber } = await createInvoicePdf(order);

      const cloudinaryData = await uploadInvoiceToCloudinary(
        pdfPath,
        invoiceNumber
      );

      await OrderModel.findByIdAndUpdate(order._id, {
        invoice: {
          number: invoiceNumber,
          pdfUrl: cloudinaryData.pdfUrl,
          cloudinaryId: cloudinaryData.cloudinaryId,
          generatedAt: new Date(),
        },
      });

      await deleteLocalFile(pdfPath);
      console.log("✅ Invoice uploaded successfully");
    } catch (err) {
      console.error("❌ Invoice error:", err.message);
    }

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};





//  WEBHOOK 

const razorpayWebhook = async (req, res) => {
  try {
    const { event } = req.body;

    if (event === "payment.failed") {
      const payment = req.body.payload.payment.entity;

      await OrderModel.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { paymentStatus: "failed" }
      );
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ error: "Webhook error" });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  razorpayWebhook,
};
