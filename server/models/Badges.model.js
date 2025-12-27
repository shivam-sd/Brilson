const mongoose = require("mongoose");


const badgesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
}, {timestamps:true}
);



module.exports = mongoose.model("Badges", badgesSchema);
