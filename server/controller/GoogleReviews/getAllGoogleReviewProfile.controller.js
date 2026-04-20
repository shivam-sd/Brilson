const GoogleReviewModel = require("../../models/AddGoogleReviews.model");


const GetAllGoogleReviewProfiles = async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        //  Search condition
    const searchQuery = {
      $or: [
        { "profile.brandName": { $regex: search, $options: "i" } },
        { activationCode: { $regex: search, $options: "i" } }
      ]
    };

    const totleGoogleReview = await GoogleReviewModel.countDocuments(searchQuery);

    const allGoogleReview = (await GoogleReviewModel.find(searchQuery)).sort({created:-1}).skip(skip).limit(limit).populate({
        path: "owner",
        select: "name"
      });


      return res.status(200).json({
      success: true,
      page,
      limit,
      search,
      totleGoogleReview,
      totalPages: Math.ceil(totleGoogleReview / limit),
      count: allGoogleReview.length,
      allGoogleReview
    });



    }catch(err){
        console.log("From get all Google Review Profile", err);
        res.status(500).json({error:"Internal Server Error", err});
    }
}


module.exports = GetAllGoogleReviewProfiles;