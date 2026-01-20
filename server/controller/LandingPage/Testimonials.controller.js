const TestimonialsModel = require("../../models/LandingPage/Testimonials");
const cloudinary = require("cloudinary").v2;



const createTestimonials = async (req,res) => {
    try{
        const {name, rating, review} = req.body;

let imgUrl = '';
const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];

const file = req.files?.image;
if(file){
    if(!allowedFormats.includes(file.mimetype)){
        return res.status(500).json({error:"Only JPG, PNG, JPEG Are alloed"});
    }
}

const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "/brilson/testimonials"
});

imgUrl = result.secure_url;

const testimonials = await TestimonialsModel.create({
    name,
    review,
    rating,
    image:imgUrl
});


res.status(201).json({message:"Seccess",  testimonials});

    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}



const updateTestimonials = async (req,res) => {
    try{
        const {name, rating, review} = req.body;

let imgUrl = '';
const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];

const file = req.files?.image;
if(file){
    if(!allowedFormats.includes(file.mimetype)){
        return res.status(500).json({error:"Only JPG, PNG, JPEG Are alloed"});
    }
}

const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "/brilson/testimonials"
});

imgUrl = result.secure_url;

const testimonials = await TestimonialsModel.findOneAndUpdate({},{
    name,
    review,
    rating,
    image:imgUrl
}, {new:true});


res.status(200).json({message:"Update Seccess",  testimonials});

    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}



const getTestimonials = async (req,res) => {
    try{
        const testimonials = await TestimonialsModel.find();

        res.status(200).json({message:"Success", testimonials});

    }catch(err){
        res.status(500).json({error:"Internal Server error"}); 
    }
}



module.exports = {
    createTestimonials,
    updateTestimonials,
    getTestimonials
}