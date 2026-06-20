const express = require("express");

const router = express.Router();

const {
  createOrUpdateRefundPolicy,
  getRefundPolicy
} = require("../../controller/FooterSection/RefundPolicy.controller");

// CREATE OR UPDATE
router.post("/create-or-update", createOrUpdateRefundPolicy);

// GET
router.get("/get", getRefundPolicy);

module.exports = router;