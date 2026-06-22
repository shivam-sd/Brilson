const express = require("express");

const router = express.Router();

const {
  createOrUpdateRefundPolicy,
  getRefundPolicy
} = require("../../controller/FooterSection/RefundPolicy.controller");

// CREATE OR UPDATE
router.post("/create-or-update/refund-policy", createOrUpdateRefundPolicy);

// GET
router.get("/get/refund-policy", getRefundPolicy);

module.exports = router;