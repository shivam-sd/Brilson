const mongoose = require("mongoose")

const AdminPaymentGatwayschema = new mongoose.Schema({

gateway:{
 type:String,
 enum:["razorpay","cashfree","payu"]
},

isActive:{
 type:Boolean,
 default:false
}

})

module.exports = mongoose.model("Payment Gateway Active", AdminPaymentGatwayschema)