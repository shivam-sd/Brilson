const Razorpay = require("razorpay");
const { getConfig } = require("../config/runTimeConfigLoader");

function getRazorpayInstance() {
  const config = getConfig(); 

  console.log("Loaded Razorpay Config:",
  config
);


  if (!config.razorpay) {
    throw new Error("Razorpay config not loaded");
  }

  return new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  });
}

module.exports = getRazorpayInstance;

