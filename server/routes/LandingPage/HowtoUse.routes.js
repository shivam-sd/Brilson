const express = require("express");
const { createHowToUse, updateHowToUse, getHowToUse } = require("../../controller/LandingPage/HowToUseInfo.controller");
const authAdminToken = require("../../middleware/authAdminToken");
const router = express.Router();



router.post("/howtouse/create",authAdminToken, createHowToUse);
router.put("/howtouse/update", authAdminToken, updateHowToUse);
router.get("/howtouse",  getHowToUse);




module.exports = router;