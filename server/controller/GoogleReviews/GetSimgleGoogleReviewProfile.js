const GoogleReviewsModel = require("../../models/AddGoogleReviews.model");


const getSingleGoogleReviewProfile = async(req,res) => {
    try{
        const {slug} = req.params;

        console.log(slug);

        const googleReview = await GoogleReviewsModel.findOne({slug});

        if(!googleReview){
            return res.status(404).json({error:"Profile Not Found"});
        }

        res.status(200).json({message:"Profile Found", googleReview});

    }catch(err){
        console.log("from get single Google review Profile",err);
        res.status(500).json({error:"Internal Server Error", err});
    }
}


module.exports = getSingleGoogleReviewProfile;