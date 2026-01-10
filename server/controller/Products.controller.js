const ProductModel = require("../models/Product.model");
const cloudinary = require("cloudinary").v2;



// products handle bye the admin

const createProduct = async (req, res) => {
  try {
    const {
      category,
      title,
      badge,
      description,
      stock,
      price,
      oldPrice,
      discount,
      color,
      features,
      metaTags,
    } = req.body;

    const file = req?.files?.image;

    //  Required validations
    if (!category || !title || !description || !price) {
      return res.status(400).json({
        error: "Category, Title, Description and Price are required!",
      });
    }

    if (!file) {
      return res.status(400).json({
        error: "Product image is required!",
      });
    }

    /* IMAGE VALIDATION */
    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Only image files are allowed",
      });
    }

    /* UPLOAD IMAGE */
    const uploadResult = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "brilson/products" }
    );

    /* SAFE PARSING */
    const featureList = features
      ? JSON.parse(features)
      : [];

    const metaTagList = metaTags
      ? JSON.parse(metaTags)
      : [];

    /* CREATE PRODUCT */
    const product = await ProductModel.create({
      category,
      title,
      badge,
      description,
      image: uploadResult.secure_url,
      stock: stock || 0,
      price,
      oldPrice,
      discount,
      color,
      features: featureList,
      metaTags: metaTagList,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    console.error("Product Create Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};




const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const updatedData = { ...req.body };

    /* IMAGE UPDATE */
    const file = req?.files?.image;

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/gif",
        "image/avif",
      ];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          error: "Only image files are allowed",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brilson/products" }
      );

      updatedData.image = uploadResult.secure_url;
    } else {
      updatedData.image = existingProduct.image;
    }

    /* SAFE JSON PARSING */
    updatedData.features = req.body.features
      ? JSON.parse(req.body.features)
      : existingProduct.features;

    updatedData.metaTags = req.body.metaTags
      ? JSON.parse(req.body.metaTags)
      : existingProduct.metaTags;

    /* UPDATE PRODUCT */
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    console.error("Edit Product Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
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
    const allProducts = await ProductModel.find().sort({createdAt:-1});

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
