const express = require("express");
const router = express.Router();
const {AdminDashboardController, getOverviewChart} = require("../../controller/AdminDashboardAPI/AdminDashboardAPI.controller");


router.get("/dashboard", AdminDashboardController);
router.get("/dashboard/chart", getOverviewChart);


module.exports = router;