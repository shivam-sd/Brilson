const axios = require("axios");
require("dotenv").config();

const sendCartReminder = async (phoneNumber, name) => {
    try{

        const response = await axios.post( "https://aigreentick.com/api/v1/send/by_broadcast", {
            params:{
                api_key: process.env.AIGREEN_API_KEY,
          templatename: "cart_purchase_reminder",
          country: "india",
          camp_name: "Api",
          mobile_numbers: String(phoneNumber),
          variables: String(name)
            }
        })

            console.log(
      "Cart reminder response:",
      response.data
    );

    return response.data;

    }catch(err){
        console.error("Error sending cart reminder:", err);
    }
}


module.exports = sendCartReminder;