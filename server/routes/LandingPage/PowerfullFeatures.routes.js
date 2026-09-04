const express = require("express");
const { createPowerfulFeatures, updatePowerfulFeatures, getPowerfulFeatures } = require("../../controller/LandingPage/PowerfullFeatures.controller");
const authAdminToken = require("../../middleware/authAdminToken");
const router = express.Router();



router.post("/powerfull/features/create",authAdminToken, createPowerfulFeatures);
router.put("/powerfull/features/update", authAdminToken, updatePowerfulFeatures);
router.get("/powerfull/features", getPowerfulFeatures);



module.exports = router;