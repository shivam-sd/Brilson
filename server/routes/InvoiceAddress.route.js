const express = require("express");
const { SaveOrUpdateInvoiceAddress, FetchInvoiceData } = require("../controller/InvoiceAddress.cotroller");
const router = express.Router();



router.post("/invoice/address", SaveOrUpdateInvoiceAddress);
router.get("/invoice/address", FetchInvoiceData);


module.exports = router;