const mongoose = require("mongoose");

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

    badge: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    // ✅ SINGLE PRICE SYSTEM
    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    discount: {
      type: String,
    },

    color: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    metaTags: {
      type: [String],
      default: [],
    },

    // ✅ MLM CONFIG (unchanged)
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
      commission: {
        type: [MLMCommissionSchema],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
