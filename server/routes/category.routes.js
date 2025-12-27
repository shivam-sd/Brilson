const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdminToken");
const { createCetegory,getAllCategory,deleteCategory } = require("../controller/Category.controller");

// create category api
router.post("/", authAdmin, createCetegory);

// get all active category api
router.get("/active", getAllCategory);

// delete category api
router.delete("/delete/:id", deleteCategory);


module.exports = router;