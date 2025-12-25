const CardProfileModel = require("../models/CardProfile");


const markDownloadedOnCard  = async(req,res) => {
    try{
        const {id} = req.params;
        console.log(id);
        await CardProfileModel.findByIdAndUpdate(id, 
            { $set: { isDownloaded: true } },{new:true});

        res.status(200).json({success:true});

    }catch(err){
        res.status(500).json({error:"Server Error"});
    }
}



module.exports = markDownloadedOnCard;