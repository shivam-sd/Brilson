const express = require("express");
const router = express.Router();
const {
  GoogleAuthController,
  completeGoogleLogin,
  verifyGoogleOTP,
  resendGoogleOTP,
  googleLogout,
  completeGoogleLoginWithReferral
} = require("../../controller/GoogleAuth/GoogleAuthController.controller");



// Google Sign-In
router.get("/google-auth", GoogleAuthController);

// Complete profile with phone
router.post("/google/complete-profile", completeGoogleLogin);


router.post("/google/complete-referral", completeGoogleLoginWithReferral);

// Verify OTP
router.post("/google/verify-otp", verifyGoogleOTP);

// Resend OTP
router.post("/google/resend-otp", resendGoogleOTP);

router.post("/google/logout", googleLogout);

module.exports = router;