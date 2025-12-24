const CartModel = require("../models/Cart.model");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");

const addToCart = async (req, res) => {
   try {
    const userId = req.user;
    const { productId, variantId, quantity } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    let cartItem = await CartModel.findOne({
      userId,
      productId,
      variantId,
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await CartModel.create({
        userId,
        productId,
        variantId,
        variantName: variant.name,
        price: variant.price,
        quantity: quantity || 1,
      });
    }

    res.status(201).json({
      success: true,
      message: "Added to cart",
      cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Add to cart failed" });
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

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cartItem = await CartModel.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

   
    cartItem.quantity = quantity;

    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cartItem,
    });
  } catch (err) {
    console.error("Update cart error:", err);
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
    clearCart,
  }