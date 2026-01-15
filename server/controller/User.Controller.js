const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateReferralCode = require("../utils/generateReferralCode");
const CardProfileModel = require("../models/CardProfile");



// Generate Token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.BRILSON_SECRET_KEY);
};


// USER REGISTER
const UserRegister = async (req, res) => {
  try {
    const { name, phone, password, referralCode } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //  User must exist
    const user = await UserModel.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        error: "OTP not verified. Please verify OTP first."
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        error: "Phone number not verified"
      });
    }

    //  Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    //  Referral logic
    let referredBy = null;
    if (referralCode) {
      const refUser = await UserModel.findOne({ referralCode });
      if (!refUser) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
      referredBy = refUser._id;
    }

    //  Generate own referral code
    const referCode = generateReferralCode(name);

    //  Update same OTP user
    user.name = name;
    user.password = hashedPass;
    user.referralCode = referCode;
    user.referredBy = referredBy;

    // clear otp fields
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    //  Token
    const token = generateToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};



// USER LOGIN
const UserLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const findLoggedInUser = (req, res) => {
  try {
    const userId = req.user; 

    if (!userId) {
      return res.status(401).json({ error: "Please login first" });
    }

    res.status(200).json({
      success: true,
      userId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error while finding logged-in user",
    });
  }
};



const getMyActiveCard = async (req, res) => {
  const userId = req.user;

  const card = await CardProfileModel.findOne({
    owner: userId,
    isActivated: true,
  }).select("slug cardId");

  if (!card) {
    return res.json({ hasCard: false });
  }

  res.json({
    hasCard: true,
    slug: card.slug,
    cardId: card.cardId,
  });
};






module.exports = {
  UserRegister,
  UserLogin,
  findLoggedInUser,
  getMyActiveCard
};