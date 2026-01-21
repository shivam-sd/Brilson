const mongoose = require("mongoose");

const TransformNetworkSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      trim: true,
      default: "Limited Time Offer – 40% OFF",
    },

    heading: {
      type: String,
      trim: true,
      required: true,
    },

    subHeading: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);


const TransformNetworkModel = mongoose.model("TransformNetwork", TransformNetworkSchema);


module.exports = TransformNetworkModel; 
