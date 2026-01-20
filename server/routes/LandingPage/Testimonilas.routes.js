const express = require("express");
const { createTestimonials, updateTestimonials, getTestimonials } = require("../../controller/LandingPage/Testimonials.controller");
const router = express.Router();


router.post("/testimonials/create", createTestimonials);
router.put("/testimonials/update", updateTestimonials);
router.get("/testimonials", getTestimonials);


module.exports = router;