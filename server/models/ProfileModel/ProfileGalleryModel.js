const mongoose = require("mongoose");

const profileGallerySchema = new mongoose.Schema({
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
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  category: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ProfileGalleryModel = mongoose.model(
  "Profile Gallery",
  profileGallerySchema,
);

module.exports = ProfileGalleryModel;
