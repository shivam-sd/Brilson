const express = require("express");
const router = express.Router();
const {getSellingOverview} = require("../controller/adminSells.controller");
const authAdminToken = require("../middleware/authAdminToken");



router.get("/sales/overview", authAdminToken, getSellingOverview);


module.exports = router;