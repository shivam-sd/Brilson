const OrderModel = require("../models/Order.model");


const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user; // middleware se

    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    } 

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.invoice?.pdfUrl) {
      return res.status(404).json({ error: "Invoice not generated yet" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }



    return res.status(200).json({ downloadUrl: order.invoice.pdfUrl });

  } catch (error) {
    console.error("Invoice Download Error:", error);
    return res.status(500).json({ error: "Invoice download failed" });
  }
};

module.exports = { downloadInvoice };
