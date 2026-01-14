const ProductModel = require("../models/Product.model");


const productPriceCalculation = async(ProductId, quantity = 1) => {

    const product = await ProductModel.findById(ProductId);

  let price = product.price;
  let discountAmount = 0;
  let gstAmount = 0;

  // Discount
  if (product.discount?.enabled) {
    if (product.discount.type === "percentage") {
      discountAmount = (price * product.discount.value) / 100;
    } else {
      discountAmount = product.discount.value;
    }
    price -= discountAmount;
  }

  // GST
  if (product.gst?.enabled) {
    gstAmount = (price * product.gst.rate) / 100;
    price += gstAmount;
  }

  return {
    Price: Number(price.toFixed(2)),
    discountAmount,
    gstAmount,
    totalPrice: Number((price * quantity).toFixed(2))
  };
}


module.exports = productPriceCalculation;