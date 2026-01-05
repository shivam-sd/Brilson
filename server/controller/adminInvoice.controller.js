const orderModel = require("../models/Order.model");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const axios = require("axios");



const getAllInvoices = async (req, res) => {
  try {
    // PAGINATION VALUES
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    //  TOTAL COUNT
    const totalInvoices = await orderModel.countDocuments({
      "invoice.pdfUrl": { $exists: true }
    });

    // FETCH PAGINATED DATA
    const orders = await orderModel.find({
      "invoice.pdfUrl": { $exists: true }
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const invoices = orders.map(order => ({
      orderId: order._id,
      invoiceNumber: order.invoice.number,
      pdfUrl: order.invoice.pdfUrl,
      userName: order.userId?.name,
      email: order.userId?.email,
      totalAmount: order.totalAmount,
      products: order.items.map(item => ({
        name: item.productTitle,
        price: item.price,
        qty: item.quantity
      })),
      date: order.invoice.generatedAt
    }));

    res.status(200).json({
      invoices,
      pagination: {
        totalInvoices,
        currentPage: page,
        totalPages: Math.ceil(totalInvoices / limit),
        limit
      }
    });

  } catch (error) {
    console.error("Admin Invoice Error:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};





const downloadAllInvoicesZip = async (req, res) => {
  try {
    //  Get all orders having invoice pdfUrl
    const orders = await orderModel.find({
      "invoice.pdfUrl": { $exists: true, $ne: null },
    });

    if (!orders.length) {
      return res.status(404).json({ error: "No invoices found" });
    }

    //  Ensure temp directory exists
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const zipPath = path.join(tempDir, "all-invoices.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    //  Append each invoice from CLOUDINARY URL
    for (const order of orders) {
      try {
        const response = await axios.get(order.invoice.pdfUrl, {
          responseType: "stream",
        });

        archive.append(response.data, {
          name: `${order.invoice.number}.pdf`,
        });
      } catch (err) {
        console.error(
          `Failed to fetch invoice ${order.invoice.number}`,
          err.message
        );
      }
    }

    //  Finalize archive
    archive.finalize();

    //  When ZIP is ready → send to admin
    output.on("close", () => {
      res.download(zipPath, "all-invoices.zip", (err) => {
        fs.unlinkSync(zipPath); // cleanup
        if (err) console.error("ZIP download error:", err);
      });
    });

  } catch (err) {
    console.error("Error downloading invoices zip:", err);
    res.status(500).json({ error: "Failed to download invoices" });
  }
};






module.exports = {
    getAllInvoices,
    downloadAllInvoicesZip
}