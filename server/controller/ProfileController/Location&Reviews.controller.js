const LocationReviewsModel = require("../../models/ProfileModel/Location&Reviews.model");
const CardProfile = require("../../models/CardProfile");



const addLocationReviews = async (req,res) => {
    try{
        const {activationCode, googleReviewLink, googleMapLink} = req.body;

        const userId = req.user;

        // FIND CARD
    const card = await CardProfile.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }


    const LocationReview = await LocationReviewsModel.create({
        activationCode,
        owner:userId,
        cardId:card._id,
        googleMapLink,
        googleReviewLink
    }); 


    res.status(201).json({Success:true, LocationReview});


    }catch(err){
         res.status(500).json({
      message: err.message || "Server error",
    });
    console.log(err)
    }
}



const updateLocationReviews = async (req,res) => {
    try{
        const {googleReviewLink, googleMapLink} = req.body;
        const {locationId} = req.params;


        const LocationReviews = await LocationReviewsModel.findById(locationId);

        if(!LocationReviews){
            return res.status(404).json({error:"Location And Review Not Found"});
        }

        
        if(googleMapLink) LocationReviews.googleMapLink = googleMapLink || LocationReviews.googleMapLink;

        if(googleReviewLink) LocationReviews.googleReviewLink = googleReviewLink || LocationReviews.googleReviewLink;

        await LocationReviews.save();


    res.status(200).json({Success:true, LocationReviews});


    }catch(err){
         res.status(500).json({
      message: err.message || "Server error",
    });
    console.log(err)
    }
}



const getLocationReviews = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const LocationReviews = await LocationReviewsModel.findOne({activationCode});

    res.status(200).json({
      success: true,
      data: LocationReviews,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};



module.exports = {
    addLocationReviews,
    updateLocationReviews,
    getLocationReviews
}