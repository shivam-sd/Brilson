const express = require("express");

const router = express.Router();

const {
  createOrUpdatePrivacyPolicy,
  getPrivacyPolicy,
} = require("../../controller/FooterSection/PrivacyPolicy.controller");
const authAdminToken = require("../../middleware/authAdminToken");


// CREATE OR UPDATE
router.post("/create-or-update",authAdminToken, createOrUpdatePrivacyPolicy);


// GET
router.get("/get", getPrivacyPolicy);



module.exports = router;