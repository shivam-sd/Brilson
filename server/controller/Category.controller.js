const categoryModel = require("../models/Category.model");


// category create controller

const createCetegory = async (req,res) => {
    try{
        const {name} = req.body;
        const category = await categoryModel.create({name});


        res.status(201).json({success:true, category});
    }catch(err){
        res.status(400).json({error:"Category all ready exist!"});
    }
}



// get all active category

const getAllCategory = async (req,res) => {
    const category = await categoryModel.find({isActive:true}).sort({ createdAt:-1 });
    res.json({categories:category}); 
}


// delete category 
const deleteCategory = async (req,res) => {
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.json({success:true});
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}



module.exports = {
    createCetegory,
    getAllCategory,
    deleteCategory
}