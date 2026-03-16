const express = require("express");
const router = express.Router();
const authUserToken = require("../middleware/authUserToken");
const {createPaymentOrder, verifyPayment, razorpayWebhook} = require("../controller/Payment.controller");
const {createCashfreeOrder, verifyCashfreePayment} = require("../controller/Cashfree.controller");
const {createPayUOrder, VerifyPayU} = require("../controller/PayU.controller");
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
router.post("/payu/verify", VerifyPayU);

router.get("/payu-failure", (req,res) => {
    res.status(500).json({message:"Payment Failed", success:false})
});


// ADMIN PAYMENT GATEWAY ISACTIVE OR NOT
router.put("/isactive/gateway/update", updateGatewayStatus);
router.get("/isactive/gateway", getActiveGateway);

module.exports = router;