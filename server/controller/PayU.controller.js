const crypto = require("crypto");
const OrderModel = require("../models/Order.model");
const userModel = require("../models/User.model");
const PaymentModel = require("../models/PayU.model");
const createInvoicePdf = require("../utils/createInvoicePdf");
const uploadInvoiceToCloudinary = require("../utils/uploadInvoceToCloudinary");

const createPayUOrder = async(req,res)=>{

 try{

  const {orderId} = req.body;

  const order = await OrderModel.findById(orderId);

  if(!order){
    return res.status(404).json({error:"Order not found"});
  }

  const txnid = "txn_" + Date.now();

  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  const productinfo = "Order Payment";

  const hashString =
  `${key}|${txnid}|${order.totalAmount}|${productinfo}|test|test@test.com|||||||||||${salt}`;

  const hash = crypto
  .createHash("sha512")
  .update(hashString)
  .digest("hex");

  await PaymentModel.create({

    userId: order.userId,
    orderId: order._id,
    txnid: txnid,
    amount: order.totalAmount,
    status:"created"

  })



    //  UPDATE ORDER
      const Updateorder = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: "paid" },
        { new: true }
      );

        if (!Updateorder) {
      return res.status(404).json({ error: "Order not found" });
    }


      // Update user's total orders
        const user = await userModel.findById(Updateorder.userId);
        if(user){
          user.totalOrders += 1;
          await user.save();
        }
      


  res.json({

   paymentUrl:process.env.PAYU_BASE_URL,

   data:{
    key,
    txnid,
    amount:order.totalAmount,
    productinfo,
    firstname:"test",
    email:"test@test.com",
    phone:"9999999999",
    surl:`${process.env.BASE_URL}/api/payment/payu-success`,
    furl:`${process.env.BASE_URL}/api/payment/payu-failure`,
    hash
   }

  });



  try {
        const { pdfPath, invoiceNumber } = await createInvoicePdf(Updateorder);
  
        // console.log("PDF PATH Payment Controller se", pdfPath);
  
        const cloudinaryData = await uploadInvoiceToCloudinary(
          pdfPath,
          invoiceNumber
        );
  
        order.invoice = {
          number: invoiceNumber,
          pdfUrl: cloudinaryData.pdfUrl,
          cloudinaryId: cloudinaryData.cloudinaryId,
          generatedAt: new Date(),
        };
  
        await order.save();
  
        // delete local file
        // await deleteLocalFile(pdfPath);
  
        console.log("Invoice generated & uploaded successfully");
      } catch (invoiceError) {
        console.error("Invoice generation failed:", invoiceError);
      }
  

 }catch(err){

  console.error("PayU error",err)
  res.status(500).json({error:"PayU payment error"})

 }

}

module.exports={
 createPayUOrder
}