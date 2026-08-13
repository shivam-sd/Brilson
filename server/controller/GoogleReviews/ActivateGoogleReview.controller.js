const GoogleReviewsModel = require("../../models/AddGoogleReviews.model");
const generateSlug = require("../../utils/generateSlug");
const UserModel = require("../../models/User.model");



/*  ACTIVATE Google Review  */

// for the single account activate single Google Review

const ActivateGoogleReview = async (req, res) => {
  try {
    const userId = req.user; 
    const { activationCode } = req.body;

    if (!activationCode) {
      return res.status(400).json({
        error: "activation code required",
      });
    }

    /*  FIND CARD */
    const googleReview = await GoogleReviewsModel.findOne({ activationCode });

    if (!googleReview) {
      return res.status(400).json({
        error: "Invalid Google Review details",
      });
    }

    /* ALREADY ACTIVATED  */
    if (googleReview.isActivated) {
      return res.status(403).json({
        error: "This Google Review is already activated",
        slug: googleReview.slug,
      });
    }

    /*  USER EXISTS */
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const existingGoogleReview = await GoogleReviewsModel.findOne({
      owner:userId,
      isActivated:true
    });

    if(existingGoogleReview){
      return res.status(403).json({error:"you can activate only one Google Review per account! Please use another account to activate more Google Reviews."});
    }


    /*  ACTIVATE Google Review */
    googleReview.isActivated = true;
    googleReview.owner = userId; 
    googleReview.activatedAt = new Date();
    googleReview.tempSessionId = generateSlug(activationCode + Date.now());

    /*  GENERATE UNIQUE SLUG */
    googleReview.slug = activationCode;

    await googleReview.save();

    /*  ADD Google Review TO USER (NO DUPLICATE) */
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myGoogleReviews: googleReview._id } },
      { new: true }
    );

    /*  FINAL RESPONSE */
    return res.status(200).json({
      message: "Google Review activated successfully",
      activationCode: googleReview.activationCode,
      slug: googleReview.slug,
    });

  } catch (err) {
    console.error("Activate Google Review Error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};



module.exports = {
    ActivateGoogleReview,
}