const express = require("express");
const { createTestimonials, updateTestimonials, getTestimonials } = require("../../controller/LandingPage/Testimonials.controller");
const authAdminToken = require("../../middleware/authAdminToken");
const router = express.Router();


router.post("/testimonials/create",authAdminToken, createTestimonials);
router.put("/testimonials/update", authAdminToken, updateTestimonials);
router.get("/testimonials", getTestimonials);


module.exports = router;