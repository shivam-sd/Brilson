const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  color: { type: String },
  discount: { type: String },
});

// MLM Commission per level
const MLMCommissionSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true, // 1 to 7
  },
  percentage: {
    type: Number,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    badge: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    stock:Number,

    features: [String],

    metaTags: [String],

    variants: [VariantSchema],

    //  MLM fields
    isMLMProduct: {
      type: Boolean,
      default: false,
    },

    mlmConfig: {
      enabled: {
        type: Boolean,
        default: false,
      },
      levels: {
        type: Number,
        default: 7,
      },
      commission: [MLMCommissionSchema], 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
