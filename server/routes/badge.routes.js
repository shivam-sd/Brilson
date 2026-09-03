const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdminToken");
const { createBadge,getAllBadge,deleteBadge } = require("../controller/Badges.controller");
const authAdminToken = require("../middleware/authAdminToken");

// create category api
router.post("/", authAdmin, authAdminToken,createBadge);

// get all active category api
router.get("/active",authAdminToken, getAllBadge);

// delete category api
router.delete("/delete/:id", authAdminToken, deleteBadge);


module.exports = router;