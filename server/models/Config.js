const mongoose = require("mongoose");


const ConfigSchema = new mongoose.Schema({
    razorpay:{
        keyId: String,
        keySecret: String
    },
    cloudinary:{
        cloudName: String,
        apiKey: String,
        apiSecret: String
    },
      updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Config", ConfigSchema);