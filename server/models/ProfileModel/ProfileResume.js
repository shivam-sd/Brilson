const mongoose  = require("mongoose");


const ResumeSchema = new mongoose.Schema({
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
        resume:{
            type:String
        },
        name:{
          type:String
        }
});



const resumeModel = mongoose.model("Resume", ResumeSchema);



module.exports = resumeModel;