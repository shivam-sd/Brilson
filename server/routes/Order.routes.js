const express = require("express");
const router = express.Router();
const {orderCreate, updatePaymentStatus, updateOrderStatus, getOrderProduct} = require("../controller/Order.controller");
const authUser = require("../middleware/authUserToken");
const authAdminToken = require("../middleware/authAdminToken");



router.post("/orders/create", authUser, orderCreate);
router.get("/orders/", authUser, getOrderProduct);
// router.post("/orders/update/paymentStatus", updatePaymentStatus);


// order status admin change karega.
router.post("/orders/update/orderStatus", authAdminToken, updateOrderStatus);




module.exports = router;