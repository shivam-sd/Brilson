const googleReviewModel = require("../../models/AddGoogleReviews.model");
const bulkCreateGoogleReviews = require("./AdminBulkReviewCardCreate.controller");


const checkGoogleReview = async(req,res) => {
    try{
        const {activationCode} = req.params;

        const googleReview = await googleReviewModel.findOne({activationCode});

        if(!googleReview){
            return res.status(404).josn({error:"Invalid Google Review"});
        }


        console.log("Google Review", googleReview);

        if(!googleReview.isActivated){
            return res.json({isActivated:googleReview.isActivated});
        }


        console.log("Google Review is activated" , googleReview.isActivated);

       return res.status(200).json({
            isActivated:googleReview.isActivated,
            slug:googleReview.slug
        });

    }catch(err){
        res.status(500).json({error:"Internal server error", err});
    }
}





module.exports = {
    checkGoogleReview
}