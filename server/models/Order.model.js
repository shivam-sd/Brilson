const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      productTitle: String,
      variantId: mongoose.Schema.Types.ObjectId,
      variantName: String,
      quantity: Number,
      price: Number,
    }
  ],
  address: {
    name: String,
    phone: String,
    email: String,
    city: String,
    state: String,
    pincode: Number,
  },
  totalAmount: Number,
  status: {
    type: String,
    default: "pending",
  },
  orderStatus:{
    type:String,
    enum:["processing","shipped","delivered","cancelled"],
    default:"processing"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
