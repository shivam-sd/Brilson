const ConfigModel = require("../models/Config");
const { decrypt } = require("../utils/crypto");

const runtimeConfigLoader = {};

// Helper function to safely decrypt data
const safeDecrypt = (encryptedText) => {
  // Check for null, undefined, or empty string
  if (encryptedText === null || encryptedText === undefined) {
    return "";
  }
  
  if (encryptedText === "") {
    return "";
  }
  
  try {
    // Check if it's already a plain text (not encrypted)
    // Encrypted text always contains a colon
    if (!encryptedText.includes(":")) {
      console.log("Field appears to be plain text, returning as is");
      return encryptedText;
    }
    
    return decrypt(encryptedText);
  } catch (error) {
    console.error("Decryption failed for field:", error.message);
    // Return the original text if decryption fails
    return encryptedText;
  }
};

async function loadConfig() {
  try {
    const data = await ConfigModel.findOne();

    if (!data) {
      console.log("No config found");
      return;
    }

    console.log("Loading configuration from database...");

    // Load Razorpay config with safe decryption
    if (data.razorpay) {
      runtimeConfigLoader.razorpay = {
        keyId: safeDecrypt(data.razorpay.keyId),
        keySecret: safeDecrypt(data.razorpay.keySecret),
      };
      console.log("✓ Razorpay config loaded");
    }

    // Load Cloudinary config with safe decryption
    if (data.cloudinary) {
      runtimeConfigLoader.cloudinary = {
        cloudName: safeDecrypt(data.cloudinary.cloudName),
        apiKey: safeDecrypt(data.cloudinary.apiKey),
        apiSecret: safeDecrypt(data.cloudinary.apiSecret),
      };
      console.log("✓ Cloudinary config loaded");
    }

    // Load Cashfree config with safe decryption
    if (data.cashfree) {
      runtimeConfigLoader.cashfree = {
        appId: safeDecrypt(data.cashfree.appId),
        secretKey: safeDecrypt(data.cashfree.secretKey),
        environment: data.cashfree.environment || "",
      };
      console.log("✓ Cashfree config loaded");
    }

    // Load PayU config with safe decryption
    if (data.payU) {
      runtimeConfigLoader.payU = {
        key: safeDecrypt(data.payU.key),
        salt: safeDecrypt(data.payU.salt),
        payUBaseUrl: data.payU.payUBaseUrl || "",
      };
      console.log("✓ PayU config loaded");
    }

    console.log("Runtime configuration loaded successfully ", data);
    console.log("Loaded config keys:", Object.keys(runtimeConfigLoader));
    
  } catch (error) {
    console.error("Error loading configuration:", error);
    // Don't crash the app, just log the error
  }
}

function getConfig() {
  return runtimeConfigLoader;
}

module.exports = {
  loadConfig,
  getConfig,
}; 