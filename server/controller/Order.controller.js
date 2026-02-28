const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");




  //  CREATE ORDER

const orderCreate = async (req, res) => {
  try { 
    const userId = req.user;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address required" });
    }

    const cartItems = await CartModel
      .find({ userId })
      .populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let subTotal = 0;
    let amount = 0;
    let gstAmount = 0;
    let discountAmount = 0;

    const orderItems = cartItems.map((item) => {
      const product = item.productId;

      let basePrice = product.price;
      let finalPrice = basePrice;
      amount = basePrice;

      /*  DISCOUNT  */
      if (product.discount?.enabled) {
        if (product.discount.type === "percentage") {
          finalPrice -= (basePrice * product.discount.value) / 100;
        } else if (product.discount.type === "flat") {
          finalPrice -= product.discount.value;
          discountAmount = product.discount.value
        }
      }
      discountAmount = product.discount.value
      
      /*  GST  */
      if (product.gst?.enabled) {
        finalPrice += (finalPrice * product.gst.rate) / 100;
        gstAmount = product.gst.rate
      }

      finalPrice = Number(finalPrice.toFixed(2));

      subTotal += finalPrice * item.quantity;

      return {
        productId: product._id,
        productTitle: product.title,
        quantity: item.quantity,
        price: finalPrice, 
        image: product.image,

        // Optional (future invoice use)
        priceBreakup: {
          basePrice,
          discountApplied: product.discount?.enabled || false,
          gstApplied: product.gst?.enabled || false,
        },
      };
    });

    /*  CREATE ORDER  */
    const order = await OrderModel.create({
      userId,
      items: orderItems,
      address,
      totalAmount: Number(subTotal.toFixed(2)),
      status: "pending",
      amount:amount,
      gstAmount:gstAmount,
      discountAmount:discountAmount
    });

    /*  CLEAR CART  */
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
    const { orderId, orderStatus } = req.body;

    const allowedStatus = [
      "pending",
      "processing", 
      "shipped",
      "delivered",
      "cancelled",
    ];

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
