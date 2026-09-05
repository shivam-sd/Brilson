const UserModel = require("../../models/User.model");
const oauth2Client = require("../../utils/ConfigureGoogleAuth.utils");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const generateOTP = require("../../utils/generateOTP");
const sendWhatsAppOTP = require("../../config/whatsapp");

const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.BRILSON_SECRET_KEY);
};



const GoogleAuthController = async (req, res) => {
  const { code } = req.query;

  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Google authorization code is required",
      });
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return res.status(400).json({
        success: false,
        message: "Google access token not received",
      });
    }

    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        params: {
          alt: "json",
          access_token: tokens.access_token,
        },
      }
    );

    const {
      id: googleId,
      email,
      name,
      picture,
      verified_email,
    } = userRes.data;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: "Unable to get Google account information",
      });
    }

    if (!verified_email) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    let user = await UserModel.findOne({ googleId });

    if (user) {
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        await user.save();
        console.log("✅ Fixed isGoogleUser for user:", user._id);
      }

      if (user.phone && user.isVerified) {
        const token = generateToken(user._id);
        const isProduction = process.env.NODE_ENV === "production";

        user.activeToken = token;
        await user.save();

        res.cookie("token", token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          status: "SUCCESS",
          message: "Login successful",
          data: {
            token,
            user: {
              _id: user._id,
              name: user.name,
              phone: user.phone,
              email: user.email,
              isGoogleUser: user.isGoogleUser,
              isVerified: user.isVerified,
              referralCode: user.referralCode
            }
          }
        });
      }

      return res.status(200).json({
        success: true,
        status: "PHONE_REQUIRED",
        message: "Please complete your profile with phone number",
        data: {
          userId: user._id,
          googleId: user.googleId,
          email: user.email,
          name: user.name || name,
          picture: user.profilePicture || picture,
          isExistingUser: true,
          hasPhone: !!user.phone,
          isVerified: user.isVerified,
          referralCode: user.referralCode || null
        }
      });
    }

    // Check if user exists with email
    if (email) {
      user = await UserModel.findOne({ email });
      
      if (user) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.profilePicture = user.profilePicture || picture;
        await user.save();

        if (user.phone && user.isVerified) {
          const token = generateToken(user._id);
          const isProduction = process.env.NODE_ENV === "production";

          user.activeToken = token;
          await user.save();

          res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          return res.status(200).json({
            success: true,
            status: "SUCCESS",
            message: "Login successful",
            data: {
              token,
              user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                isGoogleUser: user.isGoogleUser,
                isVerified: user.isVerified,
                referralCode: user.referralCode
              }
            }
          });
        }

        return res.status(200).json({
          success: true,
          status: "PHONE_REQUIRED",
          message: "Please complete your profile with phone number",
          data: {
            userId: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.profilePicture || picture,
            isExistingUser: true,
            hasPhone: !!user.phone,
            isVerified: user.isVerified,
            referralCode: user.referralCode || null
          }
        });
      }
    }



    const newUser = new UserModel({
      name: name || "User",
      email: email || null,
      googleId: googleId,
      isGoogleUser: true,
      isVerified: false,
      phone: null,
      password: null,
      profilePicture: picture || null,

    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      status: "PHONE_REQUIRED",
      message: "Google sign-in successful. Please enter your phone number.",
      data: {
        userId: newUser._id,
        googleId: newUser.googleId,
        email: newUser.email,
        name: newUser.name,
        picture: newUser.profilePicture,
        isExistingUser: false,
        hasPhone: false,
        isVerified: false,
        referralCode: null
      }
    });

  } catch (err) {
    console.error("Google Auth Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};



const completeGoogleLogin = async (req, res) => {
  try {
    const { userId, phone } = req.body;

    if (!userId || !phone) {
      return res.status(400).json({
        success: false,
        message: "User ID and phone number are required",
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number",
      });
    }

    const existingUser = await UserModel.findOne({
      phone: phone,
      _id: { $ne: userId }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This phone number is already registered. Please login instead.",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This is not a Google user account",
      });
    }

    user.isGoogleUser = true;

    if (user.phone && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Profile already completed",
      });
    }

    user.phone = phone;
    user.isVerified = false;

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    try {
      await sendWhatsAppOTP(phone, otp);
    } catch (whatsappError) {
      console.error("WhatsApp send error:", whatsappError);
    }

    return res.status(200).json({
      success: true,
      status: "OTP_REQUIRED",
      message: "OTP sent to your phone. Please verify.",
      data: {
        userId: user._id,
        phone: user.phone,
        requiresOTP: true
      }
    });

  } catch (err) {
    console.error("Complete Google Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to complete Google login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};



const verifyGoogleOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number not found",
      });
    }

    if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    //  REFERRAL_REQUIRED
    return res.status(200).json({
      success: true,
      status: "REFERRAL_REQUIRED",
      message: "Phone verified successfully. Please enter referral code if you have one.",
      data: {
        userId: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        isGoogleUser: user.isGoogleUser,
        isVerified: user.isVerified,
        hasReferralCode: !!user.referralCode,
        referralCode: user.referralCode || null,
        requiresReferral: true
      }
    });

  } catch (err) {
    console.error("Verify Google OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};



const completeGoogleLoginWithReferral = async (req, res) => {
  try {
    const { userId, referralCode } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

 

    if (referralCode && referralCode.trim() !== "") {
      // Check if referral code exists in database
      const refUser = await UserModel.findOne({ 
        referralCode: referralCode.trim().toUpperCase() 
      });
      
      if (!refUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code. Please try again or skip.",
        });
      }

      // Check if user already has a referrer
      if (user.referredBy) {
        return res.status(400).json({
          success: false,
          message: "You have already used a referral code.",
        });
      }

      //  Link referral
      user.referredBy = refUser._id;
      refUser.referralStatus = "in_progress";
      await refUser.save();
      
      console.log(`✅ Referral linked: ${user._id} -> ${refUser._id}`);
    }


    await user.save();


    const token = generateToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";

    user.activeToken = token;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      status: "SUCCESS",
      message: referralCode ? "Account created with referral!" : "Account created successfully!",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email || null,
          isGoogleUser: user.isGoogleUser,
          isVerified: user.isVerified,
          referredBy: user.referredBy,
          referralCode: user.referralCode,
          referralStatus: user.referralStatus
        }
      }
    });

  } catch (err) {
    console.error("Complete Google Login With Referral Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to complete login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};



const resendGoogleOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number not found",
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendWhatsAppOTP(user.phone, otp);
    } catch (whatsappError) {
      console.error("WhatsApp send error:", whatsappError);
    }

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (err) {
    console.error("Resend Google OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};



const googleLogout = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.BRILSON_SECRET_KEY);
        const userId = decoded.userId;
        const user = await UserModel.findById(userId);
        if (user) {
          user.activeToken = null;
          await user.save();
        }
      } catch (err) {
        console.log("Google logout token error:", err.message);
      }
    }

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {
        redirectTo: "/login"
      }
    });

  } catch (error) {
    console.error("Google Logout Error:", error);
    res.clearCookie("token");
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};




module.exports = {
  GoogleAuthController,
  completeGoogleLogin,
  verifyGoogleOTP,
  completeGoogleLoginWithReferral,
  resendGoogleOTP,
  googleLogout
};