const ProductModel = require("../models/Product.model");

const updateProductPricing = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      gstEnabled,
      gstRate,
      discountEnabled,
      discountType,
      discountValue,
    } = req.body;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // GST Update
    product.gst.enabled = gstEnabled;
    if (gstEnabled && gstRate !== undefined) {
      product.gst.rate = gstRate;
    }

    // Discount Update
    product.discount.enabled = discountEnabled;
    if (discountEnabled) {
      product.discount.type = discountType || "percentage";
      product.discount.value = discountValue || 0;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product pricing updated successfully",
      product,
    });

  } catch (err) {
    console.error("Pricing Update Error:", err);
    res.status(500).json({ error: "Pricing update failed" });
  }
};

module.exports = updateProductPricing;
