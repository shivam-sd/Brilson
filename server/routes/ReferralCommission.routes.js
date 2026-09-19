const express = require("express");

const {
  getReferralCommissions,
  updateReferralCommission,
} = require("../controller/ReferralCommission.controller");

const router = express.Router();

router.get(
  "/referral-commissions",
  getReferralCommissions
);

router.put(
  "/referral-commissions/:level",
  updateReferralCommission
);

module.exports = router;