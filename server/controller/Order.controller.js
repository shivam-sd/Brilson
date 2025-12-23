const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");



const orderCreate = async (req, res) => {
  try {
    const userId = req.user;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const cartItems = await CartModel.find({ userId }).populate("productId");
// console.log(cartItems)
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id,
      productTitle:item.productId?.title,
      quantity: item.quantity,
      price: Number(item.price) + 29,
      variantId: item.variantId,
      variantName: item.variantName ,

    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (isNaN(totalAmount)) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    const order = await OrderModel.create({
      userId,
      items: orderItems,
      totalAmount,
      address,
    });

    res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Order create error:", error);
    res.status(500).json({ error: "Server Error" ,error });
  }
};




// order product get with order details

const getOrderProduct = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await OrderModel.find({ userId })
      .populate("items.productId");

    res.status(200).json({
      orders,
      totalOrders: orders.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};







const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    const allowedStatus = ["processing", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(orderStatus)) {
      return res.status(400).json({ error: "Invalid Order Status" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order Status Updated",
      order,
    });

  } catch (err) {
    console.log("Error in Update Order Status", err);
    res.status(500).json({ error: "Server Error" });
  }
};




module.exports = {
  orderCreate,
  getOrderProduct,
  updateOrderStatus
}
