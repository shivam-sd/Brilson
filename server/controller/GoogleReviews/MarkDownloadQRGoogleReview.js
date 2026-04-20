const GoogleReviewModel = require("../../models/AddGoogleReviews.model");


const markDownloadQRGoogleReviews = async(req,res) => {
    try{
        const {id} = req.params;
        console.log(id);

        await GoogleReviewModel.findByIdAndUpdate(id, 
            { $set: {isDownloaded:true}}, {new:true});

            res.status(200).json({success:true, activationCode:GoogleReviewModel.activationCode});
        

    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Server Error"});
    }
}


module.exports = markDownloadQRGoogleReviews;