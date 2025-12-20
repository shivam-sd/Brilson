const razorpay = require("../config/razorpay");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Payment.model");
const crypto = require("crypto");
const distributeMLMCommission = require("../controller/mlmCommission.controller");

const createPaymentOrder = async (req, res) => {
  try {

    const userId = req.user;
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    // Save payment record
    await PaymentModel.create({
      orderId: order._id,
      userId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      status: "created",
    });

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("Create Payment Error:", err);
    res.status(500).json({ error: "Payment order creation failed" });
  }
};

// payment success ke baad frontend ish api ko call karega.

const verifyPayment = async (req, res) => {
  try {
        console.log("VErify Payment Start")
    const userId = req.user;
    const { orderId } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update payment
    const payment = await PaymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );
    console.log("Mlm start")
    
    await distributeMLMCommission({
      order,
      buyerId: userId,
      referralCode: order.referralCode,
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Update order
    await OrderModel.findByIdAndUpdate(payment.orderId, {
      paymentStatus: "paid",
      orderStatus: "processing",
    });


    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

        console.log("VErify Payment end")
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

const razorpayWebhook = async (req, res) => {
  const { event } = req.body;

  if (event === "payment.failed") {
    const payment = req.body.payload.payment.entity;

    await OrderModel.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { paymentStatus: "failed" }
    );
  }

  res.json({ status: "ok" });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  razorpayWebhook,
};
