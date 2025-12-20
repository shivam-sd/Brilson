const CardProfileModel = require("../models/CardProfile");
const generateActivationCode = require("../utils/generateActivationCode");
// const genrateSlug = require("../utils/generateSlug");

const bulkCreateCards = async (req, res) => {
  try {
    const { count } = req.body;

    if (!count || count <= 0) {
      return res.status(400).json({ error: "Invalid count" });
    }

    const cards = [];

    for (let i = 0; i < count; i++) {
      cards.push({
        cardId: "CARD_" + Date.now() + Math.floor(Math.random()) + i,
        activationCode: generateActivationCode(),
      });
    }

    await CardProfileModel.insertMany(cards);

    res.json({
      message: "Cards created",
      cards,
    });
  } catch (err) {
    res.status(500).json({ error: "Bulk create failed",err });
    console.log("error in bulk create cards:",err);
  }
};

module.exports = bulkCreateCards;
