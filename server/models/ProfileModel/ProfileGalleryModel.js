const mongoose = require("mongoose");

const profileGallerySchema = new mongoose.Schema({
    cardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CardProfile",
          required: true,
        },
        owner: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User",
           },
           activationCode:{
            type:String,
           },
           title: {
            type:String,
            trim:true
           },
              description: {
                type: String,
                trim: true,
                },
                image:{
                    type:String,
                },
                category:{
                    type:String,
                },
                date:{
                    type:Date,
                    default:Date.now
                }
});



const ProfileGalleryModel = mongoose.model("Profile Gallery", profileGallerySchema);


module.exports = ProfileGalleryModel;