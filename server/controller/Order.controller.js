const OrderModel = require("../models/Order.model");
const CartModel = require("../models/Cart.model");
const ProductModel = require("../models/Product.model");



const orderCreate = async (req, res) => {
  try {
    const userId = req.user;  

    const { address, referralCode, } = req.body;

    // Get user cart
    const cartItems = await CartModel.find( {userId} ).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    //  Prepare order items & calculate total
    let totalAmount = 0;

    const orderItems = cartItems.map((item) => {
      totalAmount += item.price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || "",
      };
    });

    //  Create order
    const order = await OrderModel.create({
      userId,
      items: orderItems,
      totalAmount,
      address,
      paymentStatus: "pending",  // after payment ham uska response set karenge. 
      orderStatus: "processing",
      referralCode
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (err) {
    console.log("Create Order Error", err);
    res.status(500).json({ error: "Server Error" });
  }
};


// order product get with order details

const getOrderProduct = async (req, res) => {
  try {
    const allOrders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("items.productId");

    if (!allOrders || allOrders.length === 0) {
      return res.status(200).json({
        message: "No orders found",
        orders: [],
      });
    }

    res.status(200).json({
      message: "Order details fetched successfully",
      orders: allOrders,
      totalOrders: allOrders.length,
    });

  } catch (err) {
    console.log("Error in Get Order Product", err);
    res.status(500).json({ error: "Server Error" });
  }
};






const updateOrderStatus = async (req,res) => {
  try{
    
    const {orderId, orderStatus} = req.body;
    
    const allowedStatus = ["processing", "shipped", "delivered", "cancelled"];
    
    if(!allowedStatus.includes(orderStatus)){
      return res.status(400).json({error:"Invalid Order Status"});
    }
    
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
    {orderStatus},
    {new:true}
  );
  
  
  res.status(200).json({message:"Order Status Updated", 
    order
  });

}catch(err){
  res.status(500).json({error:"Server Error"});
  console.log("Error in Update Order Status", err);
}
}



module.exports = {
  orderCreate,
  getOrderProduct,
  updateOrderStatus
}
