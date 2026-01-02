const express = require("express");
const router = express.Router();
const {getSellingOverview} = require("../controller/adminSells.controller");
const authAdmin = require("../middleware/authAdminToken");



router.get("/sales/overview", getSellingOverview);


module.exports = router;