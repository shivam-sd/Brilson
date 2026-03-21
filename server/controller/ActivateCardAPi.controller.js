const CardProfileModel = require("../models/CardProfile");
const generateSlug = require("../utils/generateSlug");
const distributeActivationCommission = require("../utils/distributeActivationCommission");
const UserModel = require("../models/User.model");


/*  ACTIVATE CARD  */
const ActivateCardAPi = async (req, res) => {
  try {
    const userId = req.user;
    const { activationCode } = req.body;

    if (!activationCode) {
      return res.status(400).json({
        error: "activation code required",
      });
    }

    const card = await CardProfileModel.findOne({ activationCode });

    if (!card) {
      return res.status(400).json({
        error: "Invalid card details",
      });
    }

    if (card.isActivated) {
      return res.status(403).json({
        error: "This card is already activated",
        slug: card.slug,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    /*  ACTIVATE CARD  */
    card.isActivated = true;
    card.owner = userId;
    card.activatedAt = new Date();
    card.tempSessionId = generateSlug(activationCode + Date.now());
    card.slug = activationCode;

    await card.save();

    /*  ADD CARD TO USER  */
    user.myCards.addToSet(card._id);


    const refferdByUser = await UserModel.findById(user.referredBy);

    // console.log("Refferd By User:", refferdByUser);
    // if(!refferdByUser){
    //    return res.status(400).json({
    //     error: "Invalid referral details",
    //   });
    // }

    // user.activatedCardsCount += 1;

    /*  FIRST ACTIVATION  GIVE REWARD  */
    if (user.referredBy) {

  const refferdByUser = await UserModel.findById(user.referredBy);

  if (refferdByUser) {
     user.referralStatus = "completed";
    await user.save();
  }

  await distributeActivationCommission(user._id);
} else {
      await user.save();
      await refferdByUser.save();
    }

    return res.status(200).json({
      message: "Card activated successfully",
      activationCode: card.activationCode,
      slug: card.slug,
    });

  } catch (err) {
    console.error("Activate Card Error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};




const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user;

    const referrals = await UserModel.find({
      referredBy: userId
    }).select("name referralStatus createdAt");

    const total = referrals.length;
    const completed = referrals.filter(r => r.referralStatus === "completed").length;
    const inProgress = total - completed;

    res.json({
      totalReferrals: total,
      completed,
      inProgress,
      referrals
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", err });
  }
};





const EditCardProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const updateFields = {};

    // convert body  nested profile updates
    Object.keys(req.body).forEach((key) => {
      updateFields[`profile.${key}`] = req.body[key];
    });

    const card = await CardProfileModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(403).json({
        error: "You are not allowed to edit this profile",
      });
    }

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


const updateCountryCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const { countryCode } = req.body;

    const updatedProfile = await CardProfileModel.findByIdAndUpdate(
      {_id:id, owner:userId},
      {
        $set: {
          "profile.countryCode": countryCode,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Country code updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const updateWaCountryCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const { WacountryCode } = req.body;

    const updatedProfile = await CardProfileModel.findByIdAndUpdate(
      {_id:id, owner:userId},
      {
        $set: {
          "profile.WacountryCode": WacountryCode,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Country code updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports = {ActivateCardAPi, EditCardProfile, updateCountryCode, updateWaCountryCode, getMyReferrals};
