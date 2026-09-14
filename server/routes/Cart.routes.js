const express = require("express");
const router = express.Router();

const authUser = require("../middleware/authUserToken");
const {
  addToCart,
  getUserCart,
  updateCartQty,
  removeFromCart, 
  clearCart,
  mergeGuestCart,
} = require("../controller/AddToCart.cotroller");

router.post("/add", authUser, addToCart);
router.get("/user", authUser, getUserCart);
router.put("/update/:cartId", authUser, updateCartQty);
router.delete("/remove/:cartId", authUser, removeFromCart);
router.delete("/clear", authUser, clearCart);
router.post("/merge", authUser, mergeGuestCart);

module.exports = router;
