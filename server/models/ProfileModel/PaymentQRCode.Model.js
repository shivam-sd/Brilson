const mongoose = require("mongoose");

const PaymentQrSchema = mongoose.Schema({
    image:String
});



const PaymentQrModel = mongoose.model("payment qr", PaymentQrSchema);


module.exports = PaymentQrModel;