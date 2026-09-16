const mongoose = require("mongoose");

const referralCommissionSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 7,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ReferralCommissionModel = mongoose.model(
  "ReferralCommission",
  referralCommissionSchema
);

module.exports = ReferralCommissionModel;