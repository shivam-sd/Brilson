const mongoose = require("mongoose");

const powerfulFeatureItemSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String,
    default: ""
  }
});

const powerfulFeaturesSchema = new mongoose.Schema(
  {
    subHeading: {
      type: String,
      required: true
    },
    features: [powerfulFeatureItemSchema]
  },
  { timestamps: true }
);

const PowerfulFeaturesModel = mongoose.model(
  "PowerfulFeatures",
  powerfulFeaturesSchema
);

module.exports = PowerfulFeaturesModel;
