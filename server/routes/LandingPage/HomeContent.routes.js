const express = require("express");
const { createHomepageContent, updateHomepageContent, getHomepageContent } = require("../../controller/LandingPage/HomepageContent.controller");
const router = express.Router();


router.post("/home/content/create", createHomepageContent);
router.put("/home/content/update", updateHomepageContent);
router.get("/home/content/", getHomepageContent);


module.exports = router;