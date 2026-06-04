const express = require("express");

const router = express.Router();

const {
  createOrUpdateTermsConditions,
  getTermsConditions,
} = require("../../controller/FooterSection/Terms&conditions.controller");

// CREATE OR UPDATE
router.post("/create-or-update", createOrUpdateTermsConditions);

// GET
router.get("/get", getTermsConditions);

module.exports = router;