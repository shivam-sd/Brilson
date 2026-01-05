const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateReferralCode = require("../utils/generateReferralCode");
const CardProfileModel = require("../models/CardProfile");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.BRILSON_SECRET_KEY);
};



// for localhost



// USER REGISTER

// const UserRegister = async (req, res) => {
//   try {
//     const { name, email, password, refcode } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if user exists
//     const ifUserExist = await UserModel.findOne({ email });
//     if (ifUserExist) {
//       return res.status(400).json({ error: "User already registered" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(password, salt);

//     // Generate own referral code
//     const referralCode = generateReferralCode(name);

//     let referredBy = null;

//     // SET REFERRED BY 
//     if (refcode) {
//       const refUser = await UserModel.findOne({
//         referralCode: refcode,
//       });

//       if (refUser) {
//         referredBy = refUser._id;
//       }
//     }

//     // Create user 
//     const user = await UserModel.create({
//       name,
//       email,
//       password: hashedPass,
//       referralCode,
//       referredBy,
//     });

//     // Generate token
//     const token = generateToken(user._id);

//     // Send cookie
//     res.cookie("token", token, {
//       // httpOnly: true,
//       // secure: true,
//       // sameSite: "strict",
//   //      secure: process.env.NODE_ENV === "production",
//   // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//    secure: false,     
//   sameSite: "lax",   
//   // path: "/",  
//     });

//     return res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user,
//     });
//   } catch (err) {
//     console.log("Register Error:", err);
//     return res.status(500).json({ error: "Server Error" });
//   }
// };


// // USER LOGIN

// const UserLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "Invalid Credentials!" });
//     }

//     const matchPassword = await bcrypt.compare(password, user.password);

//     if (!matchPassword) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = generateToken(user._id);

//     res.cookie("token", token, {
//       // httpOnly: true,
//       // secure: true,
//       // sameSite: "strict",
//   //      secure: process.env.NODE_ENV === "production",
//   // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//    secure: false,    
//   sameSite: "lax",   
//   // path: "/",  
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user,
//     });
//   } catch (err) {
//     console.log("Login Error:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   UserRegister,
//   UserLogin,
// };







// for production


// USER REGISTER
const UserRegister = async (req, res) => {
  try {
    const { name, email, phone, password, refcode } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
 
    // Check if user exists
    const ifUserExist = await UserModel.findOne({ email });
    if (ifUserExist) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Generate own referral code
    const referralCode = generateReferralCode(name);

    let referredBy = null;

    // SET REFERRED BY 
    if (refcode) {
      const refUser = await UserModel.findOne({
        referralCode: refcode,
      });

      if (refUser) {
        referredBy = refUser._id;
      }
    }

    // Create user 
    const user = await UserModel.create({
      name,
      email,
      phone,
      password: hashedPass,
      referralCode,
      referredBy,
    });

    // Generate token
    const token = generateToken(user._id);

    // Fix cookie settings for both localhost and HTTPS
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", token, {
           httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    console.log("Register Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// USER LOGIN
const UserLogin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await UserModel.findOne({email:email, phone:phone});
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials!" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Fix cookie settings for both localhost and HTTPS
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", token, {
         httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.log("Login Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
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