const express = require("express");
const ConfigModel = require("../models/Config");
const { encrypt } = require("../utils/crypto");
const { loadConfig } = require("../config/runTimeConfigLoader");
const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { razorpay, cloudinary } = req.body;

    const updateData = {};

    // Razorpay optional
    if (razorpay?.keyId && razorpay?.keySecret) {
      updateData.razorpay = {
        keyId: encrypt(String(razorpay.keyId)),
        keySecret: encrypt(String(razorpay.keySecret)),
      };
    }

    // Cloudinary optional
    if (
      cloudinary?.cloudName &&
      cloudinary?.apiKey &&
      cloudinary?.apiSecret
    ) {
      updateData.cloudinary = {
        cloudName: encrypt(String(cloudinary.cloudName)),
        apiKey: encrypt(String(cloudinary.apiKey)),
        apiSecret: encrypt(String(cloudinary.apiSecret)),
      };
    }

    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid configuration provided",
      });
    }

    updateData.updatedAt = new Date();

    await ConfigModel.findOneAndUpdate({}, updateData, {
      upsert: true,
      new: true,
    });

    await loadConfig();

    res.json({ message: "Config updated successfully" });
  } catch (err) {
    console.error("Error updating config:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/", async (req,res) => {
  try {
    const config = await ConfigModel.findOne({}); 
    res.json({ KeyId:config.razorpay.keyId });
  }
  catch (err) {
    console.error("Error fetching config:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
