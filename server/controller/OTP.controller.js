const UserModel = require("../models/User.model");
const generateOTP = require("../utils/generateOTP");
const sendWhatsAppOTP = require("../config/whatsapp");
const jwt = require("jsonwebtoken");


// send otp controller logic
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    let user = await UserModel.findOne({ phone });

    // OTP only for existing user
   
    if(user){
        return res.status(500).json({message: "User Allready Exist!"});
    }

    const otp = generateOTP();
     const otpExpiry = Date.now() + 5 * 60 * 1000;


      if (!user) {
      user = await UserModel.create({
        phone:phone,
      });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await sendWhatsAppOTP(phone, otp);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("OTP Sending Error:", err);
    res.status(500).json({
      message: "OTP Sending Failed",
      error: err.message,
    });
  }
};




// Verify otp controller logic

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const user = await UserModel.findOne({ phone });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      user,
    });

  } catch (err) {
    console.log("OTP Verification Error:", err);
    res.status(500).json({
      message: "OTP Verification Failed",
      error: err.message,
    });
  }
};




module.exports = {
    sendOTP,
    verifyOTP
}