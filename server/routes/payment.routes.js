const express = require("express");
const router = express.Router();
const authUserToken = require("../middleware/authUserToken");
const {createPaymentOrder, verifyPayment, razorpayWebhook} = require("../controller/Payment.controller");




router.post("/create", authUserToken, createPaymentOrder);
router.post("/verify", verifyPayment);

// payment webhook call automatically form razorpay dashboard
router.post("/webhook", razorpayWebhook);



module.exports = router;