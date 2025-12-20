const express = require("express");
const router = express.Router();

const authUser = require("../middleware/authUserToken");
const {
  addToCart,
  getUserCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} = require("../controller/AddToCart.cotroller");

router.post("/add", authUser, addToCart);
router.get("/user", authUser, getUserCart);
router.put("/update/:cartId", authUser, updateCartQty);
router.delete("/remove/:cartId", authUser, removeFromCart);
router.delete("/clear", authUser, clearCart);

module.exports = router;
