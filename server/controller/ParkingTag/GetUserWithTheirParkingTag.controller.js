const ParkingTagModel = require("../../models/AddParkingTag.model");


const getAllUsersWithTheirCards = async (req, res) => {
  try {
    const data = await ParkingTagModel.aggregate([
      {
        $match: { isActivated: true } 
      },
      {
        $group: {
          _id: "$owner",
          tags: { $push: "$$ROOT" }
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
          tags: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      usersCount: data.length,
      data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};


module.exports = {
    getAllUsersWithTheirCards
}