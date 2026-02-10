const mongoose = require("mongoose");


const profileLogoSchema = new mongoose.Schema({
    image:{
        type:String
    },
    activationCode:{
        type:String
    }
});



const profileModel = mongoose.model("Profile Logo", profileLogoSchema);


module.exports =  profileModel;