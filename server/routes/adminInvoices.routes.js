const express = require("express");
const router = express.Router();
const { getAllInvoices, downloadAllInvoicesZip } = require("../controller/adminInvoice.controller");
const authAdminToken = require("../middleware/authAdminToken");

router.get("/all", authAdminToken, getAllInvoices);
router.get("/download-zip", authAdminToken, downloadAllInvoicesZip);

module.exports = router;
