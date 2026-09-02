const CardProfileModel = require("../models/CardProfile");

//GET /api/card/:slug

const getCardProfiles = async (req, res) => {
  try {
    const { slug } = req.params;
    const card = await CardProfileModel.findOne({ slug }).populate("owner");
    if (!card) return res.status(404).json({ error: "Invalid card" });
    // console.log(card.profile);
    res.json({ profile: card.profile, card: card });
  } catch (err) {
    res.status(500).json({ error: "Internal Server error", err });
  }
};


// ish controller se ham admin side mai jo url copy ho rha hai use update kar rhe hai.
const copyUpdate = async (req, res) => {
  try {
    const card = await CardProfileModel.findByIdAndUpdate(req.params.id, {
      $inc: { copyCount: 1 },
      $set: { lastCopiedAt: new Date() }
    },
      {
        new: true
      }
    )


    if (!card) {
      return res.status(404).json({ error: "Card Not Found" });
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
      indicater: colorIndicator
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update copy count"
    });
    console.log("failed to update copy", err);
  }
}




const getAllcardsProfile = async (req, res) => {
  try {
    //  Parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 40));
    const search = req.query.search?.trim() || "";
    const status = req.query.status; // "active", "inactive", "all", or undefined
    const skip = (page - 1) * limit;

    // Build search query - ONLY for search text
    let searchQuery = {};

    //  Add search conditions if search text exists
    if (search) {
      searchQuery.$or = [
        { "profile.name": { $regex: search, $options: "i" } },
        { activationCode: { $regex: search, $options: "i" } }
      ];
    }

    // Add status filter 
    if (status === "active") {
      searchQuery.isActivated = true;
    } else if (status === "inactive") {
      searchQuery.isActivated = false;
    }
    // If status is "all" or undefined, no filter applied

    //  Get total count with filters
    const totalCards = await CardProfileModel.countDocuments(searchQuery);

    //  Get filtered cards from database
    const allCards = await CardProfileModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "name email avatar"
      })
      .lean(); // Better performance

    //  Calculate counts for response
    // const activatedCount = allCards.filter(card => card.isActivated === true).length;
    // const inactiveCount = allCards.filter(card => card.isActivated === false).length;

    // Get total counts across all pages (for accurate stats)
    // const totalActivated = await CardProfileModel.countDocuments({ 
    //   ...searchQuery, 
    //   isActivated: true 
    // });
    // const totalInactive = await CardProfileModel.countDocuments({ 
    //   ...searchQuery, 
    //   isActivated: false 
    // });

    return res.status(200).json({
      success: true,
      data: {
        cards: allCards,
        pagination: {
          page,
          limit,
          totalCards,
          totalPages: Math.ceil(totalCards / limit),
          hasNext: page < Math.ceil(totalCards / limit),
          hasPrev: page > 1
        },
        filters: {
          search: search || "none",
          status: status || "all"
        },
      }
    });

  } catch (error) {
    console.error("Search Cards Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cards",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

const getRecentCards = async (req, res) => {
  try {
    //  Parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search?.trim() || "";
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let searchQuery = {};

    if (search) {
      searchQuery.$or = [
        { "profile.name": { $regex: search, $options: "i" } },
        { activationCode: { $regex: search, $options: "i" } }
      ];
    }
    searchQuery.isActivated = true;
    const totalCards = await CardProfileModel.countDocuments(searchQuery);

    const allCards = await CardProfileModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "name email avatar"
      })
      .lean();


    return res.status(200).json({
      success: true,
      data: {
        cards: allCards,
        pagination: {
          page,
          limit,
          totalCards,
          totalPages: Math.ceil(totalCards / limit),
          hasNext: page < Math.ceil(totalCards / limit),
          hasPrev: page > 1
        },
        filters: {
          search: search || "none",
          status: status || "all"
        },
      }
    });

  } catch (error) {
    console.error("Search Cards Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cards",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};


module.exports = { getCardProfiles, getAllcardsProfile, copyUpdate, getRecentCards };