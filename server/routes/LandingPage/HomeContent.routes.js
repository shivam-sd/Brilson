const express = require("express");
const { createHomepageContent, updateHomepageContent, getHomepageContent } = require("../../controller/LandingPage/HomepageContent.controller");
const authAdminToken = require("../../middleware/authAdminToken");
const router = express.Router();


router.post("/home/content/create",authAdminToken,createHomepageContent);
router.put("/home/content/update", authAdminToken, updateHomepageContent);
router.get("/home/content/", getHomepageContent);


module.exports = router;