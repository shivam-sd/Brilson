const ProductModel = require("../models/Product.model");



// products handle bye the admin

const createProduct = async (req, res) => {
  try {
    const {
      category,
      title,
      badge,
      description,
      stock,
      features,
      metaTags,
      variants,
    } = req.body;

    // Validation
    if (!category || !title || !badge || !description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // features
    let featureList = features;
    if (typeof features === "string") {
      featureList = features.split(",").map((f) => f.trim());
    }

    // metaTags
    let metaTagList = metaTags;
    if(typeof metaTags === "string"){
      metaTagList = metaTags.split(",").map((m) => m.trim());
    }



    // varients
    let variantData = variants;
    if (typeof variants === "string") {
      try {
        variantData = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({ error: "Invalid variants format!" });
      }
    }

    // Create Product
    const product = await ProductModel.create({
      category,
      title,
      badge,
      stock,
      description,
      features: featureList,
      metaTags: metaTagList,
      variants: variantData,
    });

    res.status(201).json({
      message: "Product Created Successfully",
      product,
    });
  } catch (err) {
    console.log("Product Create Error:", err);
    res.status(500).json({ error: "Internal Server Error", err });
  }
};



const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;


        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (err) {
        console.log("Error in editProduct", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });

  } catch (err) {
    console.log("Error in deleteProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const findProductById = async (req,res) => {
  try{
    const {id} = req.params;

    const product = await ProductModel.findById(id);

    if(!product){
      return res.status(404).json({error:"Product Not Found"});
    }

    res.status(200).json({message:"Product Find", product});

  }catch(err){
    res.status(500).json({message:"Internal Server Error"});
    console.log("Error in Find Product By Id", err);
  }
}


const getAllProduct = async (req,res) => {
  try{
    const allProducts = await ProductModel.find();

    res.status(200).json({message:"All Products", allProducts});
  }catch(err){
    res.status(500).json({error:"Internal Server Error"});
    console.log("Error In Get All Product", err);
  }
}



module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  findProductById,
  getAllProduct
};








// ishi formate me data send hoga

// const formData = {
//   category: "Basic Card",
//   title: "Basic QR Card",
//   badge: "BASIC",
//   description: "Simple & effective QR card.",
//   features: ["QR Code", "Lifetime Validity"],
//   variants: [
//     {
//       name: "White",
//       price: 299,
//       oldPrice: 399,
//       image: "/cards/basic-standard.png",
//       color: "White",
//       discount: "40%"
//     }
//   ]
// };
