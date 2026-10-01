const mongoose = require("mongoose");


const profileLogoSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    activationCode: {
        type: String,
        index: true,
    }
});



const profileModel = mongoose.model("Profile Logo", profileLogoSchema);


module.exports = profileModel;