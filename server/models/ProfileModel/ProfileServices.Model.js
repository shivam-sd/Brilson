const mongoose = require("mongoose");

const ProfileService = new mongoose.Schema(
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

    features: [
      {
        type: String,
        trim: true,
      },
    ],


    price: {
      type: Number,
      required: true,
    },

  },
  { timestamps: true }
);

const ProfileServicesModel = mongoose.model( "Profile Service", ProfileService );

module.exports = ProfileServicesModel;