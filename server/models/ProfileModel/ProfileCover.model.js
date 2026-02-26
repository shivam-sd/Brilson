const mongoose = require("mongoose");

const ProfileCoverPhoto = new mongoose.Schema({
    
        image:{
            type:String
        },
        activationCode:{
            type:String
        }
    
});



const profileCoverPhoto = mongoose.model("Profile Cover Photo", ProfileCoverPhoto);


module.exports = profileCoverPhoto;