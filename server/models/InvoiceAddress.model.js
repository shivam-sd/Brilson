const mongoose = require("mongoose");


const invoiceAddress = new mongoose.Schema({

    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    address:{
        type:String
    }
});



const InvoiceModel = mongoose.model("Invoice Address", invoiceAddress);

module.exports = InvoiceModel;