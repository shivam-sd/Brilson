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
      color,
      features,
      metaTags,
      gstEnabled,
      gstRate,
      discountEnabled,
      discountType,
      discountValue
    } = req.body;

    if (!category || !title || !description || !price) {
      return res.status(400).json({
        error: "Category, Title, Description and Price are required!"
      });
    }

    if (!req.files || !req.files.images) {
      return res.status(400).json({
        error: "Product images are required!"
      });
    }

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif"
    ];

    let files = req.files.images;

    // convert single image to array
    if (!Array.isArray(files)) {
      files = [files];
    }

    const imagesArray = [];

    for (const file of files) {

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          error: `Invalid image format: ${file.mimetype}`
        });
      }

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "brilson/products"
        }
      );

      imagesArray.push(result.secure_url);
    }

    const featureList = features ? JSON.parse(features) : [];
    const metaTagList = metaTags ? JSON.parse(metaTags) : [];

    const product = await ProductModel.create({
      category,
      title,
      badge: badge || "",
      description,
      images: imagesArray,
      stock: stock || 0,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      color: color || "",

      discount: {
        enabled: discountEnabled === "true",
        type: discountType || "percentage",
        value: Number(discountValue) || 0
      },

      gst: {
        enabled: gstEnabled === "true",
        rate: Number(gstRate) || 18
      },

      features: featureList,
      metaTags: metaTagList
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (err) {

    console.error("Product Create Error:", err);

    if (err instanceof SyntaxError) {
      return res.status(400).json({
        error: "Invalid JSON format in features or metaTags"
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error"
    });

  }
};



const editProduct = async (req, res) => {
  try {

    const productId = req.params.id;

    const existingProduct = await ProductModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    const {
      gstEnabled,
      gstRate,
      discountEnabled,
      discountType,
      discountValue
    } = req.body;

    const updatedData = { ...req.body };

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    const uploadImage = async (file) => {

      if (!allowedFormats.includes(file.mimetype)) {
        throw new Error(`Invalid image format: ${file.mimetype}`);
      }

      const upload = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "brilson/products"
        }
      );

      return upload.secure_url;
    };

    // IMAGE UPDATE LOGIC
    if (req.files && req.files.images) {

      let files = req.files.images;

      // convert single file to array
      if (!Array.isArray(files)) {
        files = [files];
      }

      const imagesArray = [];

      for (const file of files) {
        const url = await uploadImage(file);
        imagesArray.push(url);
      }

      updatedData.images = imagesArray;

    } else {

      // keep old images
      updatedData.images = existingProduct.images;

    }

    // FEATURES
    updatedData.features = req.body.features
      ? JSON.parse(req.body.features)
      : existingProduct.features;

    // META TAGS
    updatedData.metaTags = req.body.metaTags
      ? JSON.parse(req.body.metaTags)
      : existingProduct.metaTags;

    // GST
    updatedData.gst = {
      enabled: gstEnabled === "true",
      rate: Number(gstRate) || existingProduct.gst.rate
    };

    // DISCOUNT
    updatedData.discount = {
      enabled: discountEnabled === "true",
      type: discountType || existingProduct.discount.type,
      value: Number(discountValue) || existingProduct.discount.value
    };

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {

    console.error("Edit Product Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error"
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
