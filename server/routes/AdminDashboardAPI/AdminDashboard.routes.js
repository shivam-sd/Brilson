const express = require("express");
const router = express.Router();
const {AdminDashboardController} = require("../../controller/AdminDashboardAPI/AdminDashboardAPI.controller");


router.get("/dashboard", AdminDashboardController);


module.exports = router;