const express = require("express");
const router = express.Router();
const authUserToken = require("../middleware/authUserToken");
const {createPaymentOrder, verifyPayment, razorpayWebhook} = require("../controller/Payment.controller");
const {createCashfreeOrder, verifyCashfreePayment} = require("../controller/Cashfree.controller");
const {createPayUOrder} = require("../controller/PayU.controller");
const {updateGatewayStatus, getActiveGateway} = require("../controller/AdminPaymentGatewayController");



// RAZORPAY
router.post("/create", authUserToken, createPaymentOrder);
router.post("/verify", verifyPayment);

// payment webhook call automatically form razorpay dashboard
router.post("/webhook", razorpayWebhook);


// CASHFREE
router.post("/cashfree/create", authUserToken, createCashfreeOrder);
router.post("/cashfree/verify", verifyCashfreePayment);


// PAYU
router.post("/payu/create", authUserToken, createPayUOrder);


// ADMIN PAYMENT GATEWAY ISACTIVE OR NOT
router.put("/isactive/gateway/update", updateGatewayStatus);
router.get("/isactive/gateway", getActiveGateway);

module.exports = router;