const express = require("express");
const { SaveOrUpdateInvoiceAddress, FetchInvoiceData } = require("../controller/InvoiceAddress.cotroller");
const authAdminToken = require("../middleware/authAdminToken");
const router = express.Router();



router.post("/invoice/address",authAdminToken, SaveOrUpdateInvoiceAddress);
router.get("/invoice/address", FetchInvoiceData);


module.exports = router;