const CardProfileModel = require("../models/CardProfile");


const getLoggedInUserCards = async (req, res) => {
    try {
        const userId = req.user; 
        
        const cards = await CardProfileModel.find({ owner: userId })
        .sort({ createdAt: -1 });
        
        return res.status(200).json({
      success: true,
      count: cards.length,
      cards,
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};



const getAllUsersWithTheirCards = async (req, res) => {
  try {
    const data = await CardProfileModel.aggregate([
      {
        $match: { isActivated: true } 
      },
      {
        $group: {
          _id: "$owner",
          cards: { $push: "$$ROOT" }
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
          cards: 1
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









const getoneUserMultipleCards = async (req, res) => {
  try {
    const { userId } = req.params;

    const cards = await CardProfileModel.find({ owner: userId });

    if (!cards.length) {
      return res.status(404).json({ message: "No cards found" });
    }

    

    return res.status(200).json({
      success: true,
      userId,
      cards
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};




module.exports = {getLoggedInUserCards, getAllUsersWithTheirCards, getoneUserMultipleCards};