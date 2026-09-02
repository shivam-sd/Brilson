const express = require("express");
const router = express.Router();
const {ShippingAddress, getShippingAddress} = require("../controller/ShippingAddress.controller");
const authMiddleware = require("../middleware/authUserToken");


// /api/shipping-address
router.post("/shipping-address", authMiddleware, ShippingAddress);
router.get("/shipping-address", authMiddleware, getShippingAddress);

module.exports = router;