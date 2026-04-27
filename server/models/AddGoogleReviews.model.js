const mongoose = require("mongoose");

const AddGoogleReviewsSchema = new mongoose.Schema({

  activationCode: {
    required: true,
    type: String, 
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  qrCode: {
    type: String,
  },
  qrUrl: {
    type: String,
    required: true,
  },
  isDownloaded: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  activatedAt: Date,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  profile: {
    brandName: {
      type: String,
    },
    googleReviewLink: {
      type: String,
    }
  },
});

const GoogleReviews = mongoose.model("GoogleReview", AddGoogleReviewsSchema);

module.exports = GoogleReviews; 
