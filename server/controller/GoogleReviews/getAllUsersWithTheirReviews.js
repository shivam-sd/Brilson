const GoogleReviewsModel = require("../../models/AddGoogleReviews.model");
const mongoose = require("mongoose");



const getAllUsersWithTheirReviews = async (req, res) => {
    try{

      const userId = req.user;

      const ownerId = new mongoose.Types.ObjectId(userId);

         const data = await GoogleReviewsModel.aggregate([
      {
        $match: { isActivated: true, owner: ownerId } 
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