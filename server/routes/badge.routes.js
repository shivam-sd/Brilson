const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdminToken");
const { createBadge,getAllBadge,deleteBadge } = require("../controller/Badges.controller");

// create category api
router.post("/", authAdmin, createBadge);

// get all active category api
router.get("/active", getAllBadge);

// delete category api
router.delete("/delete/:id", deleteBadge);


module.exports = router;