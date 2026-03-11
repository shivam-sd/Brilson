const mongoose = require("mongoose")

const Cashfreeschema = new mongoose.Schema({

orderId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Order"
},

userId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"User"
},

cashfreeOrderId:String,

amount:Number,
 
status:{
 type:String,
 default:"created"
}

},{timestamps:true})

module.exports = mongoose.model("CashfreePayment",Cashfreeschema)