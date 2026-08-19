const CardProfileModel = require("../models/CardProfile");

//GET /api/card/:slug

const getCardProfiles = async (req, res) => {
  try {
    const { slug } = req.params;
    const card = await CardProfileModel.findOne({ slug }).populate("owner");
    if (!card) return res.status(404).json({ error: "Invalid card" });
// console.log(card.profile);
    res.json({profile:card.profile, card:card});
  }catch(err){ 
    res.status(500).json({ error: "Internal Server error", err });
  }
};


// ish controller se ham admin side mai jo url copy ho rha hai use update kar rhe hai.
const copyUpdate = async (req, res) => {
  try{
    const card = await CardProfileModel.findByIdAndUpdate(req.params.id, {
      $inc:{copyCount:1},
      $set:{lastCopiedAt:new Date()}
    },
      {
        new:true
      }
  )


  if(!card){
    return res.status(404).json({error:"Card Not Found"});
  }


   let colorIndicator = "green"; // Default


    if (card.copyCount >= 3 && card.copyCount <= 5) {
      colorIndicator = "yellow";
    } else if (card.copyCount > 5) {
      colorIndicator = "red";
    }



   card.indicater = colorIndicator
await card.save();


      res.status(200).json({
      message: "Copy count updated",
      copyCount: card.copyCount,
      indicater:colorIndicator
    });

  }catch(err){
   res.status(500).json({
      message: "Failed to update copy count"
    });
    console.log("failed to update copy", err);
  }
} 




const getAllcardsProfile = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    //  Search condition
    const searchQuery = {
      $or: [
        { "profile.name": { $regex: search, $options: "i" } },
        { activationCode: { $regex: search, $options: "i" } }
      ]
    };

    const totalCards = await CardProfileModel.countDocuments(searchQuery);

    const allCards = await CardProfileModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "name"
      });

    return res.status(200).json({
      success: true,
      page,
      limit,
      search,
      totalCards,
      totalPages: Math.ceil(totalCards / limit),
      count: allCards.length,
      allCards
    });

  } catch (error) {
    console.error("Search Cards Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



module.exports = {getCardProfiles, getAllcardsProfile, copyUpdate};