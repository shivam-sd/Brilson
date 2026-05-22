const express = require("express");

const router = express.Router();

const {
  createOrUpdatePrivacyPolicy,
  getPrivacyPolicy,
} = require("../../controller/FooterSection/PrivacyPolicy.controller");


// CREATE OR UPDATE
router.post("/create-or-update", createOrUpdatePrivacyPolicy);


// GET
router.get("/get", getPrivacyPolicy);



module.exports = router;