const ProductModel = require("../models/Product.model");

const createMLMProduct = async (req, res) => {
  try {
    const { title, commission } = req.body;
    // commission = base percentage 

    const product = await ProductModel.findOne({ title });

    if (!product) {
      return res.status(404).json({ error: "Product Not Found!" });
    }

    //  Generate 7 level commission structure
    const commissionLevels = [];

    for (let i = 1; i <= 7; i++) {
      commissionLevels.push({
        level: i,
        percentage: commission / i, 
        // example logic:
        // L1 = 10%
        // L2 = 5%
        // L3 = 3.33%
      });
    }

    const mlmUpdateData = {
      isMLMProduct: true,
      mlmConfig: {
        enabled: true,
        levels: 7,
        commission: commissionLevels,
      },
    };

    const Mlmproduct = await ProductModel.findByIdAndUpdate(
      product._id,
      mlmUpdateData,
      { new: true, runValidators: true }
    );

    res.status(201).json({
      message: "MLM Product Created Successfully",
      Mlmproduct,
    });

  } catch (err) {
    console.log("MLM Product Error", err);
    res.status(500).json({ error: "Server Error" , err});
  }
};

module.exports = createMLMProduct;
