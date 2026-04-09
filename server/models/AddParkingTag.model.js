const mongoose = require("mongoose");

const ParkingTagSchema = new mongoose.Schema({


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
    ownerName: {
      type: String,
    },
    phone: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    vehicleType: {
      type: String,
    },
  },
});

const parkingTagModel = mongoose.model("ParkingTag", ParkingTagSchema);

module.exports = parkingTagModel;
