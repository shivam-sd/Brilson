const mongoose = require("mongoose");


const locationReviewSchema = new mongoose.Schema({
    cardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CardProfile",
          required: true,
        },
    
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    
        activationCode: {
          type: String,
        },
        googleMapLink:{
            type:String
        },
        googleReviewLink: {
            type:String
        }
});



const locationModel = mongoose.model("Location & Reviews Model", locationReviewSchema);


module.exports = locationModel;