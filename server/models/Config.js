const mongoose = require("mongoose");


const ConfigSchema = new mongoose.Schema({
    razorpay: {
        keyId: String,
        keySecret: String
    },
    cashfree: {
        appId: String,
        secretKey: String,
        environment: String
    },
    payU: {
        key: String,
        salt: String,
        payUBaseUrl: String
    },
    cloudinary: {
        cloudName: String,
        apiKey: String,
        apiSecret: String
    },
    ekQr: {
        apiKey: {
            type: String,
            default: ""
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Config", ConfigSchema);