const CartModel = require("../models/Cart.model");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");


const addToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    let cartItem = await CartModel.findOne({
      userId,
      productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await CartModel.create({
        userId,
        productId,
        image: product.image,
        title: product.title,
        price: product.price,
        quantity: quantity || 1,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Added to cart",
      cartItem,
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      error: "Add to cart failed",
    });
  }
};



const getUserCart = async (req, res) => {
  try {
    const userId = req.user;

    const cartItems = await CartModel.find({ userId })
      .populate("productId");

    const user = await UserModel.findById(userId);

    return res.status(200).json({
      success: true,
      cartItems,
      user,
    });

  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({
      error: "Failed to fetch cart",
    });
  }
};




const updateCartQty = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const cartItem = await CartModel.findById(cartId);
    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      cartItem,
    });

  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({
      error: "Update failed",
    });
  }
};





const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    await CartModel.findByIdAndDelete(cartId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({
      error: "Delete failed",
    });
  }
};


const clearCart = async (req, res) => {
  try {
    await CartModel.deleteMany({ userId: req.user });

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({
      error: "Clear cart failed",
    });
  }
};




module.exports = {
    addToCart,
    getUserCart,
    updateCartQty,
    removeFromCart,
    clearCart,
  }