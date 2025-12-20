const CartModel = require("../models/Cart.model");
const UserModel = require("../models/User.model");

const addToCart = async (req, res) => {
  try {
    const userId = req.user;
    console.log(userId);
    const { productId } = req.body;

    const existingItem = await CartModel.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();

      return res.json({
        message: "Cart updated",
        cart: existingItem,
      });
    }

    const cartItem = await CartModel.create({
      userId,
      productId,
      // price,
      quantity: 1,
    });

    res.status(201).json({
      message: "Product added to cart",
      cart: cartItem,
    });
  } catch (err) {
    console.log("Add to cart error", err);
    res.status(500).json({ error: "Internal server error",err });
  }
};



const getUserCart = async (req, res) => {
  try {
    const userId = req.user;

    const cartItems = await CartModel.find({ userId })
      .populate("productId");

      const user = await UserModel.findById(userId);

    res.json({cartItems, user});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart",err });
  }
};



const updateCartQty = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartModel.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    cartItem.quantity += quantity;
    await cartItem.save();

    res.json({ message: "Quantity updated", cartItem });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};



const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    await CartModel.findByIdAndDelete(cartId);

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};




const clearCart = async (req, res) => {
  await CartModel.deleteMany({ userId: req.user });
  res.json({ message: "Cart cleared" });
};



module.exports = {
    addToCart,
    getUserCart,
    updateCartQty,
    removeFromCart,
    clearCart
}