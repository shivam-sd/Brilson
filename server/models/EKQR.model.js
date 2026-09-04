const mongoose = require("mongoose");

const EkqrSchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ekqrOrderId: {
    type: String,  
    unique: true
  },
  clientTxnId: {
    type: String,  
    unique: true
  },
  upiTxnId: {
    type: String,  
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'paid', 'failed', 'expired'],
    default: 'created'
  },
  paymentData: {
    type: mongoose.Schema.Types.Mixed,  
    default: null
  },
  upiIntentLinks: {
    type: mongoose.Schema.Types.Mixed,  
    default: null
  }
}, { timestamps: true });

const EkqrModel = mongoose.model("EkqrPayment", EkqrSchema);

module.exports = EkqrModel;