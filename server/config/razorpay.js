const Razorpay = require("razorpay");
const { getConfig } = require("../config/runTimeConfigLoader");

function getRazorpayInstance() {
  const config = getConfig();

  if (!config.razorpay) {
    throw new Error("Razorpay config not loaded");
  }

  return new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  });
}

module.exports = getRazorpayInstance;





// const Razorpay = require("razorpay");
// const dotenv = require("dotenv").config();


// const razorpayInstance = new Razorpay({
//     key_id:process.env.KEY_ID,
//     key_secret:process.env.RAZORPAY_SECRET
// });



// module.exports = razorpayInstance;




// // const Razorpay = require("razorpay");
// // const dotenv = require("dotenv").config();
// // const {getConfig} = require("../config/runTimeConfigLoader");

// // const config = getConfig();

// // const razorpayInstance = new Razorpay({
// //     key_id:config.keyId,
// //     key_secret:config.apiSecret
// // });



// // module.exports = razorpayInstance;