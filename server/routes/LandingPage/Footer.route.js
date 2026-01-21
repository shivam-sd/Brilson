const express = require("express");
const { addFooter, updateFooter, getFooter } = require("../../controller/LandingPage/Footer.controller");
const router = express.Router();



router.post("/footer/create", addFooter);
router.put("/footer/update", updateFooter);
router.get("/footer", getFooter);




module.exports = router;