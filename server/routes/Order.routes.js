const express = require("express");
const router = express.Router();
const {orderCreate, updatePaymentStatus, updateOrderStatus, getOrderProduct, allOrders} = require("../controller/Order.controller");
const authUser = require("../middleware/authUserToken");
const authAdminToken = require("../middleware/authAdminToken");



router.post("/orders/create", authUser, orderCreate);
router.get("/orders/", authUser, getOrderProduct);
// router.post("/orders/update/paymentStatus", updatePaymentStatus);
 router.get("/allorders", allOrders);

// order status admin change karega.
router.put("/orders/update/orderStatus", authAdminToken, updateOrderStatus);




module.exports = router;