const GoogleReviewsModel = require("../../models/AddGoogleReviews.model");



const getAllUsersWithTheirReviews = async (req, res) => {
    try{
         const data = await GoogleReviewsModel.aggregate([
      {
        $match: { isActivated: true } 
      },
      {
        $group: {
          _id: "$owner",
          reviews: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          profile: {
            name: "$user.name",
            email: "$user.email",
            phone: "$user.phone"
          },
          reviews: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      usersCount: data.length,
      data
    });
    }catch(err){
        res.status(500).json({error:"internal Server Error"});
    }
}


module.exports = getAllUsersWithTheirReviews;