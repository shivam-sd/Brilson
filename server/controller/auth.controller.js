const UserModel = require("../models/User.model");
const generateOTP = require("../utils/generateOTP");
const sendWhatsAppOTP = require("../config/whatsapp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//  SEND RESET OTP 
const sendResetOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone required" });
    }

    const user = await UserModel.findOne({ phone });

    // security 
    if (!user) {
      return res.status(200).json({
        message: "Invalid User or Number",
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await sendWhatsAppOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent on WhatsApp",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};



// VERIFY RESET OTP 
const verifyResetOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone & OTP required",
      });
    }

    const user = await UserModel.findOne({
      phone,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // 🔐 reset token generate
    const resetToken = jwt.sign(
      { id: user._id, type: "reset" },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    // 🔥 OTP clear 
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified",
      resetToken,
    });

  } catch (err) {
    res.status(500).json({
      message: "OTP verification failed",
    });
  }
};




//  RESET PASSWORD 
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    // 🔐 verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    if (decoded.type !== "reset") {
      return res.status(403).json({
        message: "Invalid token type",
      });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔐 hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Password reset failed",
    });
  }
};


module.exports = {
    sendResetOTP,
    verifyResetOTP,
    resetPassword
}