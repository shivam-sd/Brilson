const CardProfileModel = require("../models/CardProfile");

const claimCardProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { slug, tempSessionId } = req.body;

    const card = await CardProfileModel.findOne({ slug, tempSessionId });

    if (!card) { 
      return res.status(403).json({ error: "Unauthorized" });
    }

    card.owner = userId;
    card.tempSessionId = null;

    await card.save();

    res.json({ message: "Profile linked to user" });
  } catch (err) {
    res.status(500).json({ error: "Claim failed" });
  }
};

module.exports = claimCardProfile;
