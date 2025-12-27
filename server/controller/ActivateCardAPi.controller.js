const CardProfileModel = require("../models/CardProfile");
const generateSlug = require("../utils/generateSlug");
const UserModel = require("../models/User.model");



/*  ACTIVATE CARD  */
const ActivateCardAPi = async (req, res) => {
  try {
    const userId = req.user; 
    const { cardId, activationCode } = req.body;

    if (!cardId || !activationCode) {
      return res.status(400).json({
        error: "Card ID and activation code required",
      });
    }

    /*  FIND CARD */
    const card = await CardProfileModel.findOne({ cardId, activationCode });

    if (!card) {
      return res.status(400).json({
        error: "Invalid card details",
      });
    }

    /* ALREADY ACTIVATED (BLOCK DUPLICATE) */
    if (card.isActivated) {
      return res.status(403).json({
        error: "This card is already activated",
        slug: card.slug,
      });
    }

    /*  USER EXISTS */
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    /*  ACTIVATE CARD */
    card.isActivated = true;
    card.owner = userId;
    card.activatedAt = new Date();
    card.tempSessionId = generateSlug(cardId + Date.now());

    /*  GENERATE UNIQUE SLUG */
    card.slug = generateSlug(`${user.name}-${cardId}`);

    await card.save();

    /*  ADD CARD TO USER (NO DUPLICATE) */
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myCards: card._id } },
      { new: true }
    );

    /*  FINAL RESPONSE */
    return res.status(200).json({
      message: "Card activated successfully",
      cardId: card.cardId,
      slug: card.slug,
    });

  } catch (err) {
    console.error("Activate Card Error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};






// const ActivateCardAPi = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { cardId, activationCode } = req.body;

//     if (!cardId || !activationCode) {
//       return res.status(400).json({
//         error: "Card ID and activation code required",
//       });
//     }

//     /*  FIND CARD  */
//     const card = await CardProfileModel
//       .findOne({ cardId, activationCode })
//       .populate("owner");

//     if (!card) {
//       return res.status(400).json({
//         error: "Invalid card details",
//       });
//     }

//     /*  ALREADY ACTIVATED  */
//     if (card.isActivated) {
//       return res.status(200).json({
//         message: "Card already activated",
//         slug: card.slug,
//       });
//     }

//     /*  ACTIVATE CARD  */
//     card.isActivated = true;
//     card.owner = userId;
//     card.activatedAt = new Date();
//     card.tempSessionId = generateSlug(cardId + Date.now());

//     /*  GENERATE SLUG  */
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     card.slug = generateSlug(user.name);

//     /*  SAVE CARD  */
//     await card.save();

//     /*  ADD CARD TO USER  */
//     await UserModel.findByIdAndUpdate(
//       userId,
//       { $addToSet: { myCards: card._id } }
//     );

//     /*  FINAL RESPONSE  */
//     return res.status(200).json({
//       message: "Card activated successfully",
//       cardId: card.cardId,
//       slug: card.slug, 
//     });

//   } catch (err) {
//     console.error("Activate Card Error:", err);
//     return res.status(500).json({
//       error: "Server error",
//     });
//   }
// };




// const ActivateCardAPi = async (req, res) => {
//   try {
//     const userId = req.user;
//     console.log(userId)
//     const { cardId, activationCode } = req.body;

//     if (!cardId || !activationCode) {
//       return res.status(400).json({ error: "Card ID and activation code required" });
//     }

//     const card = await CardProfileModel.findOne({ cardId, activationCode });

//     if (!card) {
//       return res.status(400).json({ error: "Invalid card details" });
//     }
    
//     if (card.isActivated) {
//      return res.status(200).json({ message: "Card already activated", slug:card.slug });
//    }
   
// card.isActivated = true;
//     card.owner = userId;
//     card.tempSessionId = generateSlug(cardId + Date.now());
//     card.activatedAt = new Date();
//     await card.save();


//    const user = await CardProfileModel.findOne({ cardId, activationCode }).populate("owner");
//    console.log("User Details:", user.owner.name);
//    card.slug = generateSlug(user.owner.name);
//    await card.save();



 
//  await UserModel.findByIdAndUpdate(
//    userId,
//    { $addToSet: { myCards: card._id } }
//   );
  


//     res.status(200).json({
//       message: "Card activated successfully",
//       cardId: card.cardId,
//     });
//   } catch (err) {
//     console.error("Activate Card Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };



const EditCardProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const card = await CardProfileModel.findOne({
      _id: id,
      owner: userId,   
    });

    if (!card) {
      return res.status(403).json({
        error: "You are not allowed to edit this profile",
      });
    }

    card.profile = req.body;
    await card.save();

    res.json({
      message: "Profile updated successfully",
      card,
    });

  } catch (err) {
    console.log("Error in Edit Card Profile", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};




// const EditCardProfile = async (req, res) => {
//   try {
//     const {id} = req.params; 
//     const card = await CardProfileModel.findById(id);

//     // if (card.owner._id.toString() !== req.user) {
//     //   return res.status(403).json({ error: "Not allowed" });
//     // }

//     card.profile = req.body;
//     await card.save();

//     res.json({ message: "Profile updated", card });
//   } catch (err) {
//     console.log("Error in Edit Card Profile", err);
//     res.status(500).json({ error: "Server Error", err });
//   }
// };

module.exports = {ActivateCardAPi,EditCardProfile};
