const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");

// referral link open hone per ye logic chalega.

// /product/:productId?ref=REFCODE => frontend se referral link

// validate raferral code
router.get("/validate/:refCode", async (req, res) => {
  try {
    const referralCode = req.params.refCode;

    const referralUser = await UserModel.findOne({referralCode});

    if (!referralUser) {
      return res.status(404).json({ valid: false });
    }

    res.status(200).json({
      message: "Referral Code Validate",
      valid: true,
      referralId: referralUser,
    });
  } catch (err) {
    console.log("Error in Validate Referral Code", err);
    res.status(500).json({ error: "Server Error", err });
  }
});

module.exports = router;
