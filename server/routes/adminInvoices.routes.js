const express = require("express");
const router = express.Router();
const { getAllInvoices, downloadAllInvoicesZip } = require("../controller/adminInvoice.controller");
const adminAuth = require("../middleware/authAdminToken");

router.get("/all", adminAuth, getAllInvoices);
router.get("/download-zip", adminAuth, downloadAllInvoicesZip);

module.exports = router;
