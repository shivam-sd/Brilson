const mongoose = require("mongoose");


const shippingAddressSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    fullName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }
    }
});



const shippingModel = mongoose.model("ShippingAddress", shippingAddressSchema);

module.exports = shippingModel;
