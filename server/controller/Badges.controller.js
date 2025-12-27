const badgeModel = require("../models/Badges.model");


// category create controller

const createBadge = async (req,res) => {
    try{
        const {name} = req.body;
        const badge = await badgeModel.create({name});


        res.status(201).json({success:true, badge});
    }catch(err){
        res.status(400).json({error:"Badge all ready exist!"});
    }
}



// get all active category

const getAllBadge = async (req,res) => {
    const badge = await badgeModel.find({isActive:true}).sort({ createdAt:-1 });
    res.json({badges:badge}); 
}


// delete category 
const deleteBadge = async (req,res) => {
    try{
        const {id} = req.params;
        await badgeModel.findByIdAndDelete(id);
        res.json({success:true});
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}



module.exports = {
createBadge,
getAllBadge,
deleteBadge
}