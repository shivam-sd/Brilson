const express = require("express");
const router = express.Router();

const {createOrUpdateAboutPage, getAboutPage} = require("../../controller/FooterSection/AboutPage.controller");
const authAdminToken = require("../../middleware/authAdminToken");




router.post("/create-or-update",authAdminToken, createOrUpdateAboutPage);

router.get("/get", getAboutPage);


module.exports = router;