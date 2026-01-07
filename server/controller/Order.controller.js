const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");



const orderCreate = async (req, res) => {
  try {
    const userId = req.user;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address required" });
    }

    const cartItems = await CartModel.find({ userId }).populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ error: "Please add product in cart" });
    }

    const orderItems = cartItems.map(item => ({
      productId: item.productId._id,
      productTitle: item.productId.title,
      variantId: item.variantId,
      variantName: item.variantName,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await OrderModel.create({
      userId,
      items: orderItems,
      address,
      totalAmount:totalAmount,
      status:"pending"
    }); 

    await CartModel.deleteMany({ userId });

    res.status(201).json({ success: true, order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order create failed" });
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


const allOrders = async (req,res) => {
  try {
    const orders = await OrderModel
      .find().sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (err) {
    console.error("All Orders Error:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};



module.exports = {
  orderCreate,
  getOrderProduct,
  updateOrderStatus,
  allOrders
}
