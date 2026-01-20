const mongoose = require("mongoose");


const howToUseSchema = new mongoose.Schema({
    heading:{
        type:String,
        trim:true
    },
    subHeading:{
        type:String,
        trim:true
    },
    steps:[
        {
            title:{
                type:String,
                trim:true
            },
            description:{
                type:String,
                trim:true
                },
                guide:{
                    type:String,
                }
        }
    ]
});


const howToUseModel = mongoose.model("How To Use", howToUseSchema);

module.exports = howToUseModel;