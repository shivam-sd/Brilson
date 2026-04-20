const ParkingTagModel = require("../../models/AddParkingTag.model");

//GET /api/card/:slug

const getParkingTagProfiles = async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await ParkingTagModel.findOne({ slug });
    if (!tag) return res.status(404).json({ error: "Invalid Parking Tag" });
// console.log(card.profile);
    res.json({tag:tag});
  }catch(err){ 
    res.status(500).json({ error: "Internal Server error", err });
  }
};


const getAllParkingTagsProfile = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40; 
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
 
    //  Search condition
    const searchQuery = {
      $or: [
        { "profile.ownerName": { $regex: search, $options: "i" } },
        { activationCode: { $regex: search, $options: "i" } }
      ]
    };

    const totalTags = await ParkingTagModel.countDocuments(searchQuery);

    const allTags = await ParkingTagModel.find(searchQuery)
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
      totalTags,
      totalPages: Math.ceil(totalTags / limit),
      count: allTags.length,
      allTags
    });

  } catch (error) {
    console.error("Search tags Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



module.exports = {getParkingTagProfiles, getAllParkingTagsProfile};