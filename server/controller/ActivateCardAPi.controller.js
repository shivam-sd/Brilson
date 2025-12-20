const CardProfileModel = require("../models/CardProfile");
const generateSlug = require("../utils/generateSlug");
const UserModel = require("../models/User.model");

const ActivateCardAPi = async (req, res) => {
  try {
    const userId = req.user;
    console.log(userId)
    const { cardId, activationCode } = req.body;

    if (!cardId || !activationCode) {
      return res.status(400).json({ error: "Card ID and activation code required" });
    }

    const card = await CardProfileModel.findOne({ cardId, activationCode });

    if (!card) {
      return res.status(400).json({ error: "Invalid card details" });
    }
    
    if (card.isActivated) {
     return res.status(200).json({ message: "Card already activated", slug:card.slug });
   }
   
card.isActivated = true;
    card.owner = userId;
    card.tempSessionId = generateSlug(cardId + Date.now());
    card.activatedAt = new Date();
    await card.save();


   const user = await CardProfileModel.findOne({ cardId, activationCode }).populate("owner");
   console.log("User Details:", user.owner.name);
   card.slug = generateSlug(user.owner.name);
   await card.save();



 
 await UserModel.findByIdAndUpdate(
   userId,
   { $addToSet: { myCards: card._id } }
  );
  


    res.status(200).json({
      message: "Card activated successfully",
      cardId: card.cardId,
    });
  } catch (err) {
    console.error("Activate Card Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};




const EditCardProfile = async (req, res) => {
  try {
    const {id} = req.params; 
    const card = await CardProfileModel.findById(id);

    // if (card.owner._id.toString() !== req.user) {
    //   return res.status(403).json({ error: "Not allowed" });
    // }

    card.profile = req.body;
    await card.save();

    res.json({ message: "Profile updated", card });
  } catch (err) {
    console.log("Error in Edit Card Profile", err);
    res.status(500).json({ error: "Server Error", err });
  }
};

module.exports = {ActivateCardAPi,EditCardProfile};
