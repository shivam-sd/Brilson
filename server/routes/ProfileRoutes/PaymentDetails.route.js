const express = require("express");
const { addPaymentDetails, updatePaymentDetails, getPaymentDetails } = require("../../controller/ProfileController/PaymentDetails.controller");
const router = express();
const authUser = require("../../middleware/authUserToken");


router.post("/add", authUser, addPaymentDetails);
router.put("/update/:paymentId", updatePaymentDetails);
router.get("/get/:activationCode", getPaymentDetails); 


module.exports = router;



