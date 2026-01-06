const userModel = require("../models/User.model");
const generateOTP = require("../utils/generateOTP");
const sendWhatsAppOTP = require("../config/whatsapp");
const jwt = require("jsonwebtoken");


// send otp controller logic
const sendOTP = async (req, res) => {
    try{

const { phone } = req.body;


const otp = generateOTP();
const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes 

let user =  await userModel.findOne({phone});


user.otp = otp;

user.otpExpiry = otpExpiry;

await user.save();


await sendWhatsAppOTP(phone, otp);

res.status(200).json({message: "OTP Send Successfully"});


    }catch(err){
        console.log("OTP Sending Error:", err);
        res.status(500).json({message:"OTP Sending Failed", error: err.message});
    }
}




// Verify otp controller logic

const verifyOTP = async (req, res) => {
    try{
        const {phone, otp} = req.body;

        const user = await userModel.findOne({phone});

        if(!user || user.otp != otp || user.otpExpiry <  Date.now()){
            return res.status(400).json({message: "Invalid or Expired OTP"});
        }

        user.isVerified = true;
        user.otp = null;
        await user.save();


        res.status(200).json({message: "OTP verified", user});

    }
    catch(err){
        console.log("OTP Verification Error:", err);
        res.status(500).json({message:"OTP Verification Failed",  err});
    }
}



module.exports = {
    sendOTP,
    verifyOTP
}