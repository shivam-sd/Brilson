const express = require("express");

const router = express.Router();

const {
  createOrUpdateTermsConditions,
  getTermsConditions,
} = require("../../controller/FooterSection/Terms&conditions.controller");
const authAdminToken = require("../../middleware/authAdminToken");

// CREATE OR UPDATE
router.post("/create-or-update",authAdminToken, createOrUpdateTermsConditions);

// GET
router.get("/get", getTermsConditions);

module.exports = router;