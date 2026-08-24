const UserModel = require("../models/User.model");
const ParkingTagModel = require("../models/AddParkingTag.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const generateReferralCode = require("../utils/generateReferralCode");
const CardProfileModel = require("../models/CardProfile");
const nodemailer = require("nodemailer");



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
      refUser.referralStatus = "in_progress";
      // refUser.referralCount += 1
      await refUser.save();
    }

    //  Generate own referral code
    // const referCode = generateReferralCode(name);

    //  Update same OTP user
    user.name = name;
    user.password = hashedPass;
    // user.referralCode = referCode;
    user.referredBy = referredBy;

    // clear otp fields
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    //  Token
    const token = generateToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";

    // user.activeToken = token;
    // await user.save();

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

    //   if (user.activeToken) {
    //   return res.status(403).json({
    //     message: "Your account is already logged in on another device"
    //   });
    // }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // user.activeToken = token;
    await user.save();

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
    cosnole.log(err.stack)
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
    userId: userId,
  });
};


const userlogout = async (req, res) => {
  try {
    const userId = req.user;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.activeToken = null;
    // await user.save();

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Logout error" });
  }
};



const AllUsers = async (req, res) => {
  try{
    const page = parseInt(req.query.page || 1);
    const limit = 15;
    const skip = (page - 1) * limit;
    
const totalPage =  Math.ceil(await UserModel.countDocuments() / limit);

    const allUsers = await UserModel.find().skip(skip).limit(limit).lean()
    
    let Users = []

    allUsers.map((u) => {
       const obj = {id:u._id, name:u.name, phone:u.phone, joined:u.createdAt, totalOrders:u.totalOrders}
       Users.push(obj);
    });

console.log(Users)

    res.status(200).json({
      page,
      limit,
      skip,
      totalPage,
      Users:Users
    })

  }catch(err){
     res.status(500).json({error:"Internal Server Error"});
  }
}





module.exports = {
  UserRegister,
  UserLogin,
  findLoggedInUser,
  getMyActiveCard,
  userlogout,
  AllUsers
};