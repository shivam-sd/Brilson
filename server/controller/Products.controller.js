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
      features,
      metaTags,
      variants,
    } = req.body;


    const file = req?.files?.image;

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

    // image formate
    let imageUrl = "";
    if(file){
          const allowdFormates = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif", "image/avif"];
          if(!allowdFormates.includes(file.mimetype)){
            return res.status(400).json({error:"Only images are allowed (jpeg, jpg, png, webp, svg, gif, avif)"});
          }

          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "brilson/products"
          });

          imageUrl = result.secure_url;

    }
    // Create Product
    const product = await ProductModel.create({
      category,
      title,
      badge,
      stock,
      description,
      image: imageUrl,
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

    // Find existing product
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Clone body 
    const updatedData = { ...req.body };

    /*  IMAGE HANDLING  */
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

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brilson/products" }
      );

      updatedData.image = result.secure_url;
    } else {
      //  keep old image
      updatedData.image = existingProduct.image;
    }

    /*  SAFE JSON PARSING  */
    updatedData.features = req.body.features
      ? JSON.parse(req.body.features)
      : [];

    updatedData.metaTags = req.body.metaTags
      ? JSON.parse(req.body.metaTags)
      : [];

    updatedData.variants = req.body.variants
      ? JSON.parse(req.body.variants)
      : [];

    /*  VALIDATIONS  */
    if (!updatedData.variants.length) {
      return res.status(400).json({
        error: "At least one variant is required",
      });
    }

    /*  UPDATE PRODUCT  */
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
      data: updatedProduct,
    });

  } catch (err) {
    console.error("Error in editProduct:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
