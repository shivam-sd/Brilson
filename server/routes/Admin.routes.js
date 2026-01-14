const express = require("express");
const { adminRegister, adminLogin } = require("../controller/Admin.Controller");
const router = express.Router();
const authAdminToken = require("../middleware/authAdminToken");
const { createProduct, editProduct, deleteProduct, getAllProduct, findProductById } = require("../controller/Products.controller");
const createMLMProduct = require("../controller/AdminMLMProductCreate.controller");
const updateGSTDiscountPricing = require("../controller/UpdateGSTDiscountPricing");



// admin routes
router.post("/register", adminRegister);
router.post("/login", adminLogin);

 
// products routes
router.post("/add/products", createProduct);
router.put("/update/products/:id", editProduct);
router.delete("/delete/products/:id", deleteProduct);
router.get("/find/products/:id" , findProductById);
router.get("/all/products", getAllProduct);
// router.post("/update/pricing/:id", updateGSTDiscountPricing);



// MLM Enabled Product By Admin 

router.put("/ismlm/product", authAdminToken, createMLMProduct);


module.exports = router;