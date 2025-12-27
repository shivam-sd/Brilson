const CardProfileModel = require("../models/CardProfile");
const generateActivationCode = require("../utils/generateActivationCode");
const crypto = require("crypto");

const bulkCreateCards = async (req, res) => {
  try {
    const { count } = req.body;

    if (!count || count <= 0) {
      return res.status(400).json({ error: "Invalid count" });
    }

    const cards = [];

    for (let i = 0; i < count; i++) {
      const cardId =
        "CARD_" + crypto.randomInt(1_000_000_000, 9_999_999_999);

      cards.push({
        cardId,
        activationCode: generateActivationCode(),
        qrUrl: `${process.env.BASE_URL1}/c/card/${cardId}`,
      });
    }

    await CardProfileModel.insertMany(cards);

    res.status(201).json({
      success: true,
      message: "Cards created successfully",
      cards,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk create failed" });
  }
};

module.exports = bulkCreateCards;
