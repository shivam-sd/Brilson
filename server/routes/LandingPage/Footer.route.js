const express = require("express");
const { addFooter, updateFooter, getFooter } = require("../../controller/LandingPage/Footer.controller");
const authAdminToken = require("../../middleware/authAdminToken");
const router = express.Router();



router.post("/footer/create", authAdminToken, addFooter);
router.put("/footer/update", authAdminToken, updateFooter);
router.get("/footer", getFooter);




module.exports = router;