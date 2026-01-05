const express = require("express");
const router = express.Router();
const { downloadInvoice } = require("../controller/Invoice.controller");
const Userauth = require("../middleware/authUserToken");

router.get("/download/:orderId", Userauth, downloadInvoice);

module.exports = router;
