const mongoose = require("mongoose")

const PayUschema = new mongoose.Schema({

orderId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Order"
},

userId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"User"
},

txnid:String,
mihpayid:String,

amount:Number,

status:{
 type:String,
 default:"created"
}

},{timestamps:true})

module.exports = mongoose.model("PayUPayment",PayUschema);