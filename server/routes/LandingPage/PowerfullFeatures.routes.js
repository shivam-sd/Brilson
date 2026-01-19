const express = require("express");
const { createPowerfulFeatures, updatePowerfulFeatures, getPowerfulFeatures } = require("../../controller/LandingPage/PowerfullFeatures.controller");
const router = express.Router();



router.post("/powerfull/features/create", createPowerfulFeatures);
router.put("/powerfull/features/update", updatePowerfulFeatures);
router.get("/powerfull/features", getPowerfulFeatures);



module.exports = router;