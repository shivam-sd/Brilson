const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");
const mongoose = require("mongoose");




//  CREATE ORDER
const orderCreate = async (req, res) => {
  try {
    const userId = req.user;
    const { address, items } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items required",
      });
    }

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid productId: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${item.productId}`,
        });
      }
    }

    const itemMap = new Map();

    for (const item of items) {
      const productId = item.productId.toString();

      if (itemMap.has(productId)) {
        const existing = itemMap.get(productId);

        existing.quantity += Number(item.quantity);
      } else {
        itemMap.set(productId, {
          productId: item.productId,
          quantity: Number(item.quantity),
        });
      }
    }

    const uniqueItems = Array.from(itemMap.values());

    const productIds = uniqueItems.map(
      (item) => item.productId
    );

    const products = await ProductModel.find({
      _id: {
        $in: productIds,
      },
      isDeleted: 0,
    });

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    for (const item of uniqueItems) {
      if (!productMap.has(item.productId.toString())) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }
    }

    let subtotal = 0;
    let discountAmount = 0;
    let gstAmount = 0;
    let shippingAmount = 0;

    const orderItems = [];

    for (const item of uniqueItems) {
      const product = productMap.get(
        item.productId.toString()
      );

      const quantity = item.quantity;

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} has only ${product.stock} item(s) available`,
        });
      }

      const price = Number(product.price) || 0;

      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.title}`,
        });
      }

      const itemSubtotal = price * quantity;

      let itemDiscount = 0;

      if (product.discount?.enabled === true) {
        const discountValue =
          Number(product.discount.value) || 0;

        if (product.discount.type === "percentage") {
          itemDiscount =
            (itemSubtotal * discountValue) / 100;
        }

        else if (product.discount.type === "fixed") {
          itemDiscount = discountValue;
        }
      }
      itemDiscount = Math.min(
        itemDiscount,
        itemSubtotal
      );

      const taxableAmount =
        itemSubtotal - itemDiscount;

      let itemGst = 0;

      if (product.gst?.enabled === true) {
        const gstRate =
          Number(product.gst.rate) || 0;

        itemGst =
          (taxableAmount * gstRate) / 100;
      }

      let itemShipping = 0;

      if (product.shipping?.enabled === true) {
        itemShipping =
          Number(product.shipping.charge) || 0;
      }

      subtotal += itemSubtotal;

      discountAmount += itemDiscount;

      gstAmount += itemGst;

      shippingAmount += itemShipping;

      const itemTotal =
        taxableAmount +
        itemGst +
        itemShipping;

      orderItems.push({
        productId: product._id,

        productTitle: product.title,

        productImage: product.coverImg || "",

        quantity,

        price: Number(price.toFixed(2)),
      });
    }

    subtotal = Number(
      subtotal.toFixed(2)
    );

    discountAmount = Number(
      discountAmount.toFixed(2)
    );

    gstAmount = Number(
      gstAmount.toFixed(2)
    );

    shippingAmount = Number(
      shippingAmount.toFixed(2)
    );

    const totalAmount = Number(
      (
        subtotal -
        discountAmount +
        gstAmount +
        shippingAmount
      ).toFixed(2)
    );

    const order = await OrderModel.create({
      userId,

      items: orderItems,

      address,

      amount: subtotal,

      totalAmount,

      discountAmount,

      gstAmount,

      shippingAmount,

    });

    return res.status(201).json({
      success: true,

      message: "Order created successfully",

      order,
    });

  } catch (error) {
    console.log(
      "Order Create Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Order create failed",
    });
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


    // console.log(orders)

    const sevenDays = new Date();
    sevenDays.setDate(sevenDays.getDate() - 7);

    const lastSevenDaysOrder = orders.filter((order) => {
      return new Date(order.createdAt) >= sevenDays
    });

    console.log(lastSevenDaysOrder);

    res.status(200).json({
      success: true,
      count: lastSevenDaysOrder.length,
      lastSevenDaysOrder,
    });
  } catch (err) {
    console.error("All Orders Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

const GetOrderDetails = async (req, res) => {
  try {
    const userId = req.user;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID" });
    }

    const orderDetails = await OrderModel.findOne({ _id: orderId });
    console.log(orderDetails)
    if (!orderDetails) {
      return res.status(404).json({ error: "Order Details Not Found" });
    }

    res.status(200).send({
      message: "Order Details",
      data: {
        address: orderDetails?.address,
        items: orderDetails?.items,
        amount: orderDetails?.amount,
        totalAmount: orderDetails?.totalAmount,
        paymentStatus: orderDetails?.status,
        orderStatus: orderDetails?.orderStatus,
      }
    });


  } catch (err) {
    console.log("error from get order details", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const getLabelData = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: "Please provide selected Order IDs" });
    }

    const labelsData = await OrderModel.find({
      _id: { $in: orderIds }
    })

    if (!labelsData || labelsData.length === 0) {
      return res.status(404).json({ error: "No orders found for the provided IDs" });
    }

    res.status(200).json({
      message: "Label Data Fetched Successfully",
      data: labelsData
    });

  } catch (err) {
    console.log("Error from get label data API", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {
  orderCreate,
  getOrderProduct,
  updateOrderStatus,
  allOrders,
  GetOrderDetails,
  getLabelData
}
