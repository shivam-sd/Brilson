const getRazorpayInstance = require("../config/razorpay");
const { getConfig } = require("../config/runTimeConfigLoader");

const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Payment.model");
const crypto = require("crypto");
const distributeMLMCommission = require("../controller/mlmCommission.controller");


//  CREATE PAYMENT ORDER 

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const config = getConfig();

    if (!config.razorpay) {
      return res.status(500).json({ error: "Razorpay config not loaded" });
    }

    //  Signature verification using runtime secret
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update payment record
    const payment = await PaymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Update order status
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: "paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Optional MLM logic
    // await distributeMLMCommission(order);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
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
