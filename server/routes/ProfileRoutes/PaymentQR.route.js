const express = require("express");
const { updateQrCode, getPaymentQr } = require("../../controller/ProfileController/PaymentQRCode.controller");
const router = express();


router.put("/update", updateQrCode);
router.get("/get", getPaymentQr);


module.exports = router;



