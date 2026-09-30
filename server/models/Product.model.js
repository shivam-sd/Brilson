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
    coverImg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
      }
    ],

    //  SINGLE PRICE SYSTEM
    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    discount: {
      enabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: "percentage"
      },
      value: {
        type: Number,
        default: 0
      }
    },

    gst: {
      enabled: {
        type: Boolean,
        default: false
      },
      rate: {
        type: Number,
        default: 18
      }
    },
    shipping: {
      enabled: {
        type: Boolean,
        default: false
      },
      charge: {
        type: Number,
        default: 0
      }
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

    //  MLM CONFIG 
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
      isDelete: {
        type: Number,
        default: 0
      }
    },
    isDeleted: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
