const mongoose = require("mongoose");

const PaymentDetailsSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardProfile",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activationCode: {
      type: String,
    },

    image: {
      type: String, // QR Image URL
    },

    upi: {
      type: String,
      trim: true,
    },

    paymentDetails: {
      bankName: {
        type: String,
        trim: true,
      },

      bankHolderName: {
        type: String,
        trim: true,
      },

      accountNumber: {
        type: String,  
        trim: true,
      },

      ifscCode: {
        type: String,
        uppercase: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const PaymentDetailsModel = mongoose.model(
  "PaymentDetails",
  PaymentDetailsSchema
);

module.exports = PaymentDetailsModel;
