const express = require("express");
const { createHowToUse, updateHowToUse, getHowToUse } = require("../../controller/LandingPage/HowToUseInfo.controller");
const router = express.Router();



router.post("/howtouse/create", createHowToUse);
router.put("/howtouse/update", updateHowToUse);
router.get("/howtouse", getHowToUse);




module.exports = router;