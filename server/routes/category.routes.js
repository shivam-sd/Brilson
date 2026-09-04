const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdminToken");
const { createCetegory,getAllCategory,deleteCategory } = require("../controller/Category.controller");
const authAdminToken = require("../middleware/authAdminToken");

// create category api
router.post("/", authAdmin, authAdminToken,createCetegory);

// get all active category api
router.get("/active",authAdminToken, getAllCategory);

// delete category api
router.delete("/delete/:id", authAdminToken, deleteCategory);


module.exports = router;