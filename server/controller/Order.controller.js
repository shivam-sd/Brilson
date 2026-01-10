const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");




  //  CREATE ORDER

const orderCreate = async (req, res) => {
  try {
    const userId = req.user;
    const { address, totalAmount } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address required" });
    }

    const cartItems = await CartModel
      .find({ userId })
      .populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    /* MAP CART → ORDER ITEMS */
    const orderItems = cartItems.map(item => ({
      productId: item.productId._id,
      productTitle: item.productId.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    /* CALCULATE AMOUNT (SAFETY) */
    const subTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const tax = Number((subTotal * 0.05).toFixed(2));
    const finalAmount = subTotal + tax;

    /* CREATE ORDER */
    const order = await OrderModel.create({
      userId,
      items: orderItems,
      address,
      totalAmount: totalAmount || finalAmount,
      status: "pending",
    });

    /* CLEAR CART */
    await CartModel.deleteMany({ userId });

    res.status(201).json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).json({ error: "Order create failed" });
  }
};


  //  USER ORDERS

const getOrderProduct = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await OrderModel
      .find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

/* 
   UPDATE ORDER STATUS (ADMIN)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const allowedStatus = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid Order Status" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

/* 
   ALL ORDERS (ADMIN)
 */
const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel
      .find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("All Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


module.exports = {
  orderCreate,
  getOrderProduct,
  updateOrderStatus,
  allOrders
}
