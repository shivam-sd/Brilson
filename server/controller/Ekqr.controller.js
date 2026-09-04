const axios = require("axios");
const { getConfig } = require("../config/runTimeConfigLoader");
const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");
const EkqrModel = require("../models/EKQR.model");
const crypto = require("crypto");


const createEkqrOrder = async (req, res) => {
  const config = getConfig();

  const base_url = process.env.REDIRECT_URL;
  
  try {
    const { orderId } = req.body;
    
    // Order find 
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    
    const clientTxnId = `txn_${order._id}_${Date.now()}`;

  
    const postData = {
      // key: config?.ekqr?.apiKey || process.env.EKQR_API_KEY,
      key:  process.env.EKQR_API_KEY,
      client_txn_id: clientTxnId,
      amount: order.totalAmount.toString(),
      p_info: `Order #${order._id.toString().slice(-8)}`,
      customer_name: order.address?.name || "Customer",
      customer_email: order.address?.email || "customer@example.com",
      customer_mobile: order.address?.phone || "9876543210",
      redirect_url: `${base_url}/api/payment/payment-status?order_id=${orderId}`,
      udf1: orderId.toString(),
      udf2: "",
      udf3: ""
    };


    console.log("EKQR Create Order Request:", postData);

    // EKQR API Call
    const response = await axios.post(
      "https://api.ekqr.in/api/create_order",
      postData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("EKQR Create Order Response:", response.data);

    // Check response
    if (!response.data.status) {
      return res.status(400).json({
        error: response.data.msg || "EKQR order creation failed"
      });
    }

    
    const ekqrPayment = await EkqrModel.create({
      userId: order.userId,
      orderId: order._id,
      ekqrOrderId: response.data.data.order_id,
      clientTxnId: clientTxnId,
      amount: order.totalAmount,
      status: "created",
      paymentData: response.data.data,
      upiIntentLinks: response.data.data.upi_intent || null
    });

    
    res.json({
      success: true,
      payment_url: response.data.data.payment_url,
      upi_intent: response.data.data.upi_intent,
      ekqr_order_id: response.data.data.order_id,
      client_txn_id: clientTxnId,
      payment_id: ekqrPayment._id
    });

  } catch (err) {
    console.error("EKQR create error:", err.response?.data || err.message);
    res.status(500).json({
      error: "EKQR payment initialization failed"
    });
  }
};



const verifyEkqrPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Order find
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // EKQR Payment record find
    const ekqrPayment = await EkqrModel.findOne({ orderId: order._id });
    if (!ekqrPayment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // if Already paid 
    if (ekqrPayment.status === "paid") {
      return res.json({ success: true, message: "Payment already verified" });
    }


    const config = getConfig();
    const txnDate = new Date(ekqrPayment.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');

    const postData = {
      // key: config?.ekqr?.apiKey || process.env.EKQR_API_KEY,
      key: process.env.EKQR_API_KEY,
      client_txn_id: ekqrPayment.clientTxnId,
      txn_date: txnDate
    };

    console.log("EKQR Check Status Request:", postData);

    const response = await axios.post(
      "https://api.ekqr.in/api/check_order_status",
      postData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("EKQR Check Status Response:", response.data);

    // Success Response
    if (response.data.status && response.data.data?.status === "success") {
      // Payment Success
      ekqrPayment.status = "paid";
      ekqrPayment.upiTxnId = response.data.data.upi_txn_id;
      ekqrPayment.paymentData = response.data.data;
      await ekqrPayment.save();

      // Main Order Update 
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        order._id,
        { status: "paid" },
        { new: true }
      );

      // User Orders Count Update 
      const user = await UserModel.findById(order.userId);
      if (user) {
        user.totalOrders += 1;
        await user.save();
      }

      // Invoice Generate 
      generateInvoiceInBackground(order);

      return res.json({ 
        success: true, 
        message: "Payment verified successfully",
        payment_status: "paid"
      });
    }

    // Payment Failed or Pending
    if (response.data.data?.status === "failed") {
      ekqrPayment.status = "failed";
      await ekqrPayment.save();
      return res.status(400).json({ 
        error: "Payment failed",
        payment_status: "failed"
      });
    }

    // Pending Status
    return res.status(202).json({
      success: false,
      message: "Payment is still pending",
      payment_status: "pending"
    });

  } catch (err) {
    console.error("EKQR verify error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Payment verification failed"
    });
  }
};


const ekqrWebhook = async (req, res) => {
  try {
    // EKQR  webhook data receive 
    const webhookData = req.body;
    console.log("EKQR Webhook Received:", webhookData);

    // Webhook data validate
    if (!webhookData.client_txn_id || !webhookData.status) {
      return res.status(400).json({ error: "Invalid webhook data" });
    }

    // Payment record find
    const ekqrPayment = await EkqrModel.findOne({ 
      clientTxnId: webhookData.client_txn_id 
    });

    if (!ekqrPayment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Status Update 
    if (webhookData.status === "success") {
      ekqrPayment.status = "paid";
      ekqrPayment.upiTxnId = webhookData.upi_txn_id;
      ekqrPayment.paymentData = webhookData;
      await ekqrPayment.save();

      // Main Order Update 
      const order = await OrderModel.findByIdAndUpdate(
        ekqrPayment.orderId,
        { status: "paid" },
        { new: true }
      );

      // User Orders Count Update 
      const user = await UserModel.findById(ekqrPayment.userId);
      if (user) {
        user.totalOrders += 1;
        await user.save();
      }

      // Invoice Generate
      generateInvoiceInBackground(order);

    } else if (webhookData.status === "failed") {
      ekqrPayment.status = "failed";
      await ekqrPayment.save();
    }

    // EKQR Success Response 
    res.json({ status: true, msg: "Webhook processed successfully" });

  } catch (err) {
    console.error("EKQR Webhook error:", err);
    
    res.status(200).json({ status: true, msg: "Webhook received" });
  }
};



const checkEkqrStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const ekqrPayment = await EkqrModel.findOne({ orderId });
    if (!ekqrPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({
      status: ekqrPayment.status,
      amount: ekqrPayment.amount,
      upiTxnId: ekqrPayment.upiTxnId,
      createdAt: ekqrPayment.createdAt
    });

  } catch (err) {
    console.error("Check EKQR status error:", err);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};



const paymentStatus = async (req, res) => {
   try {
    const { order_id, udf1 } = req.query;
    
    console.log("📥 Payment Status Redirect Hit:", { order_id, udf1 });
    
    // EKQR order_id 
    const orderId = order_id || udf1;
    
    if (!orderId) {
      console.log("❌ No Order ID found in query params");
      
      const frontendUrl = process.env.BASE_URL1
      return res.redirect(`${frontendUrl}/orders`);
    }

    const frontendUrl = process.env.BASE_URL1;
    const redirectUrl = `${frontendUrl}/payment-result?order_id=${orderId}`;
    
    console.log(`🔄 Redirecting to: ${redirectUrl}`);
    
    
    return res.redirect(redirectUrl);

  } catch (err) {
    console.error("❌ Payment status redirect error:", err);
    const frontendUrl = process.env.BASE_URL1;
    return res.redirect(`${frontendUrl}/orders`);
  }
}


const generateInvoiceInBackground = async (order) => {
  try {
    const createInvoicePdf = require("../utils/createInvoicePdf");
    const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");

    const { pdfPath, invoiceNumber } = await createInvoicePdf(order);
    const cloudinaryData = await uploadInvoiceToCloudinary(pdfPath, invoiceNumber);

    order.invoice = {
      number: invoiceNumber,
      pdfUrl: cloudinaryData.pdfUrl,
      cloudinaryId: cloudinaryData.cloudinaryId,
      generatedAt: new Date()
    };

    await order.save();
    console.log("Invoice generated successfully for order:", order._id);

  } catch (invoiceError) {
    console.error("Invoice generation error:", invoiceError);
  }
};

module.exports = {
  createEkqrOrder,
  verifyEkqrPayment,
  ekqrWebhook,
  checkEkqrStatus,
  paymentStatus
};