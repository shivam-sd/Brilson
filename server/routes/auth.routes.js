const express = require("express");
const router = express.Router();

const {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../controller/auth.controller");


router.post("/forgot-password", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);


module.exports = router;