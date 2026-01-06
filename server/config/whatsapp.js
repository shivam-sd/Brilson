const axios = require("axios");

const sendWhatsAppOTP = async (phone, otp) => {

  try{
    const res = await axios.get(`https://aigreentick.com/api/v1/send/by_broadcast?api_key=kL7BbTycjiygxwuRSaJsFcTWjaiN9iUt&templatename=otp&country=india&camp_name=Api&mobile_numbers=${phone}&is_media=false&media_type=image&link=abc&variables=${otp}`);

    return res;

  }catch(err){
    console.log("WhatsApp OTP Sending Error:", err);
    res,status(500).json({error:"Server Error", err});
  }

};

module.exports = sendWhatsAppOTP;
