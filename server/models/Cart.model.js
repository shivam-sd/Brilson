const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  variantName: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  // createdAt:{
  //   type:Date,
  //   default:Date.now
  // }
      reminderSentAt: {
      type: Date,
      default: null
    },

    reminderCount: {
      type: Number,
      default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
