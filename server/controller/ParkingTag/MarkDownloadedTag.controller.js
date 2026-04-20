const ParkingTagModel = require("../../models/AddParkingTag.model");


const markDownloadedOnTag  = async(req,res) => {
    try{ 
        const {id} = req.params;
        console.log(id);
        await ParkingTagModel.findByIdAndUpdate(id, 
            { $set: { isDownloaded: true } },{new:true});

        res.status(200).json({success:true, activationCode:ParkingTagModel.activationCode});

    }catch(err){
        res.status(500).json({error:"Server Error"});
    }
}



module.exports = markDownloadedOnTag;