const mongoose = require("mongoose");


const TestimonialSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    review:{
        type:String,
        trim:true
    },
    rating:{
        type:Number,
    },
    image:{
        type:String,
    }
});



const TestimonialModel = mongoose.model("Testimonials", TestimonialSchema);


module.exports = TestimonialModel;