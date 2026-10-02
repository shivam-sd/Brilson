const mongoose  = require("mongoose");


const ResumeSchema = new mongoose.Schema({
    cardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CardProfile",
          required: true,
          index: true,
        },
    
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    
        activationCode: {
          type: String,
        },
        resume:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Image",
        },
        name:{
          type:String
        }
});



const resumeModel = mongoose.model("Resume", ResumeSchema);



module.exports = resumeModel;