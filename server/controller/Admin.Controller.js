const Admin = require("../models/Admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      message: "Admin Registered Successfully",
      admin,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration Failed" });
  }
};



const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Unathorised Admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.ADMIN_SECRET_KEY,
    );


    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Login Authorised!",
      token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login Failed" });
  }
};



module.exports = {
    adminRegister,
    adminLogin
}