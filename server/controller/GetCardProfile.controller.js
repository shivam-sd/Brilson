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


const getAllcardsProfile = async (req, res) => {
  try {
    const allCards = await CardProfileModel.find().sort({createdAt: -1}).populate({
       path: "owner",
        select: "name"
    });

    // const Owners = await CardProfileModel.find().sort({createdAt: -1})

    // console.log("Owners",Owners);

    // const owner = await CardProfileModel.find().populate("owner");

    return res.status(200).json({ 
      message: allCards.length > 0 ? "Cards retrieved successfully" : "No cards found",
      count: allCards.length, 
      allCards,
      // Owners
      // owner
    });

  } catch (err) {
    console.error("Error in Get all cards profile:", err);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
}


module.exports = {getCardProfiles, getAllcardsProfile};