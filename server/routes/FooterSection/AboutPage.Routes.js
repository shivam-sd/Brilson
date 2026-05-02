const express = require("express");
const router = express.Router();

const {createOrUpdateAboutPage, getAboutPage} = require("../../controller/FooterSection/AboutPage.controller");




router.post("/create-or-update", createOrUpdateAboutPage);

router.get("/get", getAboutPage);


module.exports = router;