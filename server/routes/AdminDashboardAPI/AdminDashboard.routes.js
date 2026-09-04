const express = require("express");
const router = express.Router();
const {AdminDashboardController, getOverviewChart} = require("../../controller/AdminDashboardAPI/AdminDashboardAPI.controller");
const authAdminToken = require("../../middleware/authAdminToken");


router.get("/dashboard", authAdminToken,AdminDashboardController);
router.get("/dashboard/chart", authAdminToken,getOverviewChart);


module.exports = router;