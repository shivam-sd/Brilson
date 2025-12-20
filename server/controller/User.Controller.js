const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateReferralCode = require("../utils/generateReferralCode");

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
    const { name, email, password, refcode } = req.body;

    if (!name || !email || !password) {
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
      path: "/",
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });

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
      path: "/",
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

module.exports = {
  UserRegister,
  UserLogin,
};