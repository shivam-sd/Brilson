const GoogleReviewsModel = require("../../models/AddGoogleReviews.model");


const EditGoogleReviewsProfile = async (req,res) => {
try{
    const {id} = req.params;
    // const {data} = req.body;
    const userId = req.user;
    const updatedField = {};

    // object keys
    Object.keys(req.body).forEach((key) => {
        updatedField[`profile.${key}`] = req.body[key];
    });

    const googleReviews = await GoogleReviewsModel.findOneAndUpdate(
        {activationCode:id, owner:userId},
        {$set: updatedField},
        {new:true, runValidators:true}
    )


    if(!googleReviews){
        return res.status(400).json({
            error:"You are not allowed to edit this profile"
        });
    };


      res.json({
      message: "Profile updated successfully",
      profile:googleReviews.profile,
    });


}catch(err){
    console.log(err);
    res.status(500).json({error:"Internal Server Error", err});
}
}



module.exports = EditGoogleReviewsProfile;