const express = require("express");
const ConfigModel = require("../models/Config");
const { encrypt } = require("../utils/crypto");
const { loadConfig } = require("../config/runTimeConfigLoader");
const authAdminToken = require("../middleware/authAdminToken");
const router = express.Router();

router.post("/update",authAdminToken, async (req, res) => {
  try {
    const { razorpay, cashfree, payU, cloudinary,ekQr } = req.body;

    const updateData = {};

    const encryptedFields = {
      razorpay: ["keyId", "keySecret"],
      cashfree: ["appId", "secretKey"],
      payU: ["key", "salt"],
      cloudinary: ["cloudName", "apiKey", "apiSecret"],
      ekQr: ["apiKey"]
    };

    const plainFields = {
      cashfree: ["environment"],
      payU: ["payUBaseUrl"]
    };

    const configs = {
      razorpay,
      cashfree,
      payU,
      cloudinary,
      ekQr
    };

    Object.entries(encryptedFields).forEach(([section, fields]) => {
      const config = configs[section];

      if (!config || typeof config !== "object") return;

      fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(config, field)) {
          const value = config[field];

          updateData[`${section}.${field}`] =
            value === null || value === ""
              ? ""
              : encrypt(String(value));
        }
      });
    });

    Object.entries(plainFields).forEach(([section, fields]) => {
      const config = configs[section];

      if (!config || typeof config !== "object") return;

      fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(config, field)) {
          const value = config[field];

          updateData[`${section}.${field}`] =
            value === null || value === ""
              ? ""
              : String(value);
        }
      });
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid configuration provided"
      });
    }

    updateData.updatedAt = new Date();

    const updatedConfig = await ConfigModel.findOneAndUpdate(
      {},
      {
        $set: updateData
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    await loadConfig();

    return res.status(200).json({
      success: true,
      message: "Config updated successfully"
    });

  } catch (err) {
    console.error("Error updating config:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
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
        },
         ekQr: {
          apiKey: config.ekQr?.apiKey ? "********" : ""
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