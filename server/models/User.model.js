const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },

   activeToken: {
  type: String,
  default: null
},

    // email: {
    //   type: String,
    //   // required: true,
    //   lowercase: true,
    //   trim: true,
    // },

    phone: {
      type: String,
    },

    otp: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    otpExpiry: Date,

    password: {
      type: String,
      // required: true,
    },

    resetPasswordToken: String,
resetPasswordExpire: Date,

    // referral

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // referral chain

    referralChain: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      level: Number, // 1 se 7 tak
    },

    // Balance for rewards
    rewardBalance: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    myCards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardProfile",
      },
    ],

    myParkingTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParkingTag",
      },
    ],
    myGoogleReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoogleReview",
      },
    ],

//     referralCount: {
//   type: Number,
//   default: 0
// },

referralStatus: {
  type: String,
  enum: ["in_progress", "completed"],
  default: "in_progress"
},

hasReceivedFirstActivationReward: {
  type: Boolean,
  default: false
}

  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// const referralLink = `${window.location.origin}/product/${productId}?ref=${user.referralCode}`;
