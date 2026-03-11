const AdminPaymentGatewayActive = require("../models/AdminPaymentGetway.model");


// UPDATE GATEWAY STATUS (ADMIN)
const updateGatewayStatus = async (req,res)=>{

 try{

  const {gateway, isActive} = req.body;

  if(!gateway){
    return res.status(400).json({error:"Gateway name required"});
  }

  const gateways = ["razorpay","cashfree","payu"];

  if(!gateways.includes(gateway)){
    return res.status(400).json({error:"Invalid gateway"});
  }

  // agar kisi ek ko active karna hai to baki sab disable
  if(isActive){

    await AdminPaymentGatewayActive.updateMany(
      {},
      {isActive:false}
    )

  }

  const updatedGateway = await AdminPaymentGatewayActive.findOneAndUpdate(

    {gateway},
    {gateway,isActive},
    {new:true,upsert:true}

  )

  res.json({
    success:true,
    data:updatedGateway
  });

 }catch(err){

  console.error("Update Gateway Error",err)
  res.status(500).json({error:"Server error"})

 }

}




// GET ACTIVE GATEWAY CHECKOUT PAGE
const getActiveGateway = async (req,res)=>{

 try{

  const gateway = await AdminPaymentGatewayActive.findOne({isActive:true})

  if(!gateway){

    return res.json({
      gateway:null
    })

  }

  res.json({
    gateway:gateway.gateway
  })

 }catch(err){

  console.error("Get Gateway Error",err)
  res.status(500).json({error:"Server error"})

 }

}



module.exports = {

 updateGatewayStatus,
 getActiveGateway

}