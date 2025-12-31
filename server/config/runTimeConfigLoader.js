const ConfigModel = require("../models/Config");
const { decrypt } = require("../utils/crypto");

const runtimeConfigLoader = {};

async function loadConfig() {
  const data = await ConfigModel.findOne(); 

  // console.log("Config data from DB:", data);

  if (!data) {
    console.log(" No config found");
    return;
  }

  
  if (data.razorpay) {
    runtimeConfigLoader.razorpay = {
      keyId: decrypt(data.razorpay.keyId),
      keySecret: decrypt(data.razorpay.keySecret),
    };
  }

  if (data.cloudinary) {
    runtimeConfigLoader.cloudinary = {
      cloudName: decrypt(data.cloudinary.cloudName),
      apiKey: decrypt(data.cloudinary.apiKey),
      apiSecret: decrypt(data.cloudinary.apiSecret),
    };
  }

  // console.log("Runtime config loaded");
}

function getConfig() {
  return runtimeConfigLoader;
}

module.exports = {
  loadConfig,
  getConfig,
};
