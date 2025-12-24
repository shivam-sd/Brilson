const CardProfileModel = require("../models/CardProfile");
const generateActivationCode = require("../utils/generateActivationCode");
const crypto = require("crypto");
const generateQR = require("../utils/generateQR");





const bulkCreateCards = async (req, res) => {
  try {
    const { count } = req.body;

    if (!count || count <= 0) {
      return res.status(400).json({ error: "Invalid count" });
    }

    const cards = [];

    for (let i = 0; i < count; i++) {

      const cardId = "CARD_" + crypto.randomInt(1_000_000_000_00, 1_000_000_000_000);

      const activationCode = generateActivationCode();

      const qrCode = await generateQR(cardId);

      cards.push({
        cardId,
        activationCode,
        qrCode,      
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
    console.error("Error in bulk create cards:", err);
    res.status(500).json({
      success: false,
      error: "Bulk create failed",
    });
  }
};

module.exports = bulkCreateCards;





// const bulkCreateCards = async (req, res) => {
//   try {
//     const { count } = req.body;

//     if (!count || count <= 0) {
//       return res.status(400).json({ error: "Invalid count" });
//     }

//     const cards = [];

//     for (let i = 0; i < count; i++) {
//       cards.push({
//         cardId: "CARD_" + Date.now() + Math.floor(Math.random()) + i,
//         activationCode: generateActivationCode(),
//         await generateQR()
//       });
//     }

//     await CardProfileModel.insertMany(cards);

//     res.json({
//       message: "Cards created",
//       cards,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Bulk create failed",err });
//     console.log("error in bulk create cards:",err);
//   }
// };

// module.exports = bulkCreateCards;
