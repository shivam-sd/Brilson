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
      const activationCode = generateActivationCode();

      cards.push({
        activationCode,
        isActivated: false,

        // QR me sirf activationCode
        qrUrl: `${process.env.BASE_URL1}/c/card/${activationCode}`,
      });
    }

    await CardProfileModel.insertMany(cards);

    res.status(201).json({
      success: true,
      message: "Cards created successfully",
      total: cards.length,
      cards,
    });

  } catch (err) {
    console.error("Bulk Create Error:", err);
    res.status(500).json({ error: "Bulk create failed" });
  }
};


module.exports = bulkCreateCards;
