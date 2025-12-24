const mongoose = require("mongoose");

const CardProfileSchema = new mongoose.Schema({
  cardId: {
    type: String,
    unique: true,
    required: true
  },

  activationCode: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true,
    sparse:true
  },

  isActivated: {
    type: Boolean,
    default: false
  },

  activatedAt: Date,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  tempSessionId: String,
 
  profile: {
    name: String,
    phone: String,
    email: String,
    bio: String,
    about: String,
    city:String,
    twitter:String,
    instagram:String,
    linkedin:String,
    website: String,
  }

}, { timestamps: true });


const CardProfileModel =  mongoose.model("CardProfile", CardProfileSchema);

module.exports = CardProfileModel;
