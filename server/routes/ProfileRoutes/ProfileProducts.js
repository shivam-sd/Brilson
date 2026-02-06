const express = require("express");
const router = express.Router();

const {addProduct, updateProduct, getProducts, getSingleProduct, deleteProduct} = require("../../controller/ProfileController/ProfileProducts.controller");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addProduct);
router.put("/update/:productId", updateProduct);
router.get("/all/get/:activationCode", getProducts);
router.get("/get/single/:productId", getSingleProduct);
router.delete("/delete/:productId", deleteProduct);


module.exports = router;