const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardProfile",
      required: true,
    },
    owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
       },
       activationCode: {
         type: String,
       },
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String, 
    },
    duration: {
      type: String,              
    }
  },
  { timestamps: true }
);

const ProfilePortfolioModel = mongoose.model("Profile Portfolio", ProfileSchema);

module.exports = ProfilePortfolioModel;