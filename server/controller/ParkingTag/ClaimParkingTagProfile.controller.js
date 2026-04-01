const ParkingTagModel = require("../../models/AddParkingTag.model");

const claimParkingTagProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { slug, tempSessionId } = req.body;

    const parkingTag = await ParkingTagModel.findOne({ slug });

    if (!parkingTag) { 
      return res.status(403).json({ error: "Unauthorized" });
    }

    parkingTag.owner = userId;
    parkingTag.tempSessionId = null;

    await parkingTag.save();

    res.json({ message: "Profile linked to user" });
  } catch (err) {
    res.status(500).json({ error: "Claim failed" });
  }
};

module.exports = claimParkingTagProfile;
