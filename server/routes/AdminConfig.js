const express = require("express");
const ConfigModel = require("../models/Config");
const { encrypt } = require("../utils/crypto");
const { loadConfig } = require("../config/runTimeConfigLoader");
const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { razorpay, cashfree, payU, cloudinary } = req.body;

    const updateData = {};
    
    // Razorpay - only update if at least one field is provided
if (razorpay) {

  if (razorpay.keyId !== undefined) {
    updateData["razorpay.keyId"] = razorpay.keyId
      ? encrypt(String(razorpay.keyId))
      : "";
  }

  if (razorpay.keySecret !== undefined) {
    updateData["razorpay.keySecret"] = razorpay.keySecret
      ? encrypt(String(razorpay.keySecret))
      : "";
  }

}


    // Cashfree - only update if at least one field is provided
    if (cashfree) {

  if (cashfree.appId !== undefined) {
    updateData["cashfree.appId"] = cashfree.appId
      ? encrypt(String(cashfree.appId))
      : "";
  }

  if (cashfree.secretKey !== undefined) {
    updateData["cashfree.secretKey"] = cashfree.secretKey
      ? encrypt(String(cashfree.secretKey))
      : "";
  }

  if (cashfree.environment !== undefined) {
    updateData["cashfree.environment"] = cashfree.environment || "";
  }

}

    // PayU - only update if at least one field is provided
 if (payU) {

  if (payU.key !== undefined) {
    updateData["payU.key"] = payU.key
      ? encrypt(String(payU.key))
      : "";
  }

  if (payU.salt !== undefined) {
    updateData["payU.salt"] = payU.salt
      ? encrypt(String(payU.salt))
      : "";
  }

  if (payU.payUBaseUrl !== undefined) {
    updateData["payU.payUBaseUrl"] = payU.payUBaseUrl || "";
  }

}


    // Cloudinary - only update if at least one field is provided
 if (cloudinary) {

  if (cloudinary.cloudName !== undefined) {
    updateData["cloudinary.cloudName"] = cloudinary.cloudName
      ? encrypt(String(cloudinary.cloudName))
      : "";
  }

  if (cloudinary.apiKey !== undefined) {
    updateData["cloudinary.apiKey"] = cloudinary.apiKey
      ? encrypt(String(cloudinary.apiKey))
      : "";
  }

  if (cloudinary.apiSecret !== undefined) {
    updateData["cloudinary.apiSecret"] = cloudinary.apiSecret
      ? encrypt(String(cloudinary.apiSecret))
      : "";
  }

}
    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid configuration provided",
      });
    }

    updateData.updatedAt = new Date();

    // Use findOneAndUpdate with proper options
const updatedConfig = await ConfigModel.findOneAndUpdate(
  {},
  { $set: updateData },
  {
    upsert: true,
    returnDocument: "after",
    runValidators:true
  }
);
    console.log("Config updated successfully:", {
      razorpay: !!updatedConfig.razorpay,
      cashfree: !!updatedConfig.cashfree,
      payU: !!updatedConfig.payU,
      cloudinary: !!updatedConfig.cloudinary
    });

    // Reload runtime config
    await loadConfig();

    res.json({ 
      message: "Config updated successfully",
      success: true 
    });
  } catch (err) {
    console.error("Error updating config:", err);
    res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const config = await ConfigModel.findOne({});
    
    if (!config) {
      return res.status(404).json({ 
        success: false, 
        message: "No configuration found" 
      });
    }

    // Return the config structure without sensitive data
    res.json({
      success: true,
      config: {
        razorpay: {
          keyId: config.razorpay?.keyId ? "********" : "",
          keySecret: config.razorpay?.keySecret ? "********" : ""
        },
        cashfree: {
          appId: config.cashfree?.appId ? "********" : "",
          secretKey: config.cashfree?.secretKey ? "********" : "",
          environment: config.cashfree?.environment || "sandbox"
        },
        payU: {
          key: config.payU?.key ? "********" : "",
          salt: config.payU?.salt ? "********" : "",
          payUBaseUrl: config.payU?.payUBaseUrl || ""
        },
        cloudinary: {
          cloudName: config.cloudinary?.cloudName ? "********" : "",
          apiKey: config.cloudinary?.apiKey ? "********" : "",
          apiSecret: config.cloudinary?.apiSecret ? "********" : ""
        }
      }
    });
  } catch (err) {
    console.error("Error fetching config:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

module.exports = router;