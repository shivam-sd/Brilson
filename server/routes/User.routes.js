const express = require("express");
const { UserRegister, UserLogin, findLoggedInUser, getMyActiveCard } = require("../controller/User.Controller");
const authUser = require("../middleware/authUserToken");
const router = express.Router();
const {sendOTP, verifyOTP} = require("../controller/OTP.controller");

 

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/loggedIn/user", authUser, findLoggedInUser);
router.get("/my-active-card", authUser, getMyActiveCard);
router.post("/send-otp",  sendOTP);
router.post("/verify-otp", verifyOTP);



module.exports = router;