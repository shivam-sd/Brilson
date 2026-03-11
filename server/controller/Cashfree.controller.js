const { Cashfree } = require("cashfree-pg");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Cashfree.model");
const UserModel = require("../models/User.model");
const createInvoicePdf = require("../utils/createInvoicePdf");
const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");
const axios = require("axios");

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  "x-api-version": "2022-09-01",
};


// CREATE ORDER
const createCashfreeOrder = async (req,res)=>{

 try{

  const {orderId} = req.body;

  const order = await OrderModel.findById(orderId);

  if(!order){
    return res.status(404).json({error:"Order not found"});
  }

  const data = {

   order_id: order._id.toString(),
   order_amount: order.totalAmount,
   order_currency: "INR",

   customer_details:{
    customer_id: order.userId.toString(),
    customer_email: order.address?.email,
    customer_phone: order.address?.phone,
    customer_name: order.address?.name
   }

  }

  const response = await axios.post(
    "https://sandbox.cashfree.com/pg/orders",
    data,
    {headers}
  );

 const orderData = await PaymentModel.create({

    userId: order?.userId,
    orderId: order?._id,
    cashfreeOrderId: order?._id,
    amount: order?.totalAmount,
    status:"created"

  })

  res.json({

    paymentSessionId: response.data.payment_session_id,
    orderData
  })

 }catch(err){

  console.error("Cashfree create error",err);
  res.status(500).json({error:"Cashfree payment error"});

 }

}




const verifyCashfreePayment = async (req,res)=>{

 try{

  const {orderId} = req.body;

  const response = await axios.get(
   `https://sandbox.cashfree.com/pg/orders/${orderId}`,
   {headers}
  );


  console.log(response);
   if(response.data.order_status !== "ACTIVE"){
    return res.status(400).json({error:"Payment not completed"});
  }

  await PaymentModel.findOneAndUpdate(
    {cashfreeOrderId:orderId},
    {status:"paid"},
    {new:true}
  );

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    {status:"paid"},
    {new:true}
  );

  const user = await UserModel.findById(order.userId);

  if(user){
    user.totalOrders += 1;
    await user.save();
  }

  res.json({success:true});

  // BACKGROUND INVOICE

  try{

   const {pdfPath,invoiceNumber} = await createInvoicePdf(order);

   const cloudinaryData = await uploadInvoiceToCloudinary(
     pdfPath,
     invoiceNumber
   );

   order.invoice={
    number:invoiceNumber,
    pdfUrl:cloudinaryData.pdfUrl,
    cloudinaryId:cloudinaryData.cloudinaryId,
    generatedAt:new Date()
   }

   

   await order.save()
   console.log(order);

  }catch(invoiceError){

   console.error("Invoice error",invoiceError)

  }

 }catch(err){

  console.error("Verify Cashfree error",err)
  res.status(500).json({error:"Verification failed"})

 }

}



module.exports = {
    createCashfreeOrder,
    verifyCashfreePayment
}