const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
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
    price:{
      type:Number
    }

  },
  { timestamps: true }
);

const ProfileProductModel = mongoose.model("Profile Product", ProductSchema);

module.exports = ProfileProductModel;