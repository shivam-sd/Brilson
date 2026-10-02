const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product.model");
const { uploadImage, uploadImages, deleteImages } = require("../services/image.service");
const cloudinary = require("cloudinary").v2;
const fs = require("fs")


const toUploadFile = async (file) => ({
  buffer: file.tempFilePath
    ? await fs.promises.readFile(file.tempFilePath)
    : file.data,
  mimetype: file.mimetype,
  size: file.size,
  originalname: file.name,
});
const parseJSON = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
};

const createProduct = async (req, res) => {
  const uploadedImageIds = [];

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
      shippingEnabled,
      shippingCharge,
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

    if (!req.files || !req.files.coverImg) {
      return res.status(400).json({
        error: "Cover image is required!"
      });
    }

    if (Array.isArray(req.files.coverImg)) {
      return res.status(400).json({
        error: "Only one cover image is allowed"
      });
    }

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    const coverFile = req.files.coverImg;

    if (!allowedFormats.includes(coverFile.mimetype)) {
      return res.status(400).json({
        error: `Invalid cover image format: ${coverFile.mimetype}`
      });
    }

    let files = req.files.images;

    // convert single image to array
    if (!Array.isArray(files)) {
      files = [files];
    }

    // check format
    for (const file of files) {
      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          error: `Invalid image format: ${file.mimetype}`
        });
      }
    }

    // Cover image upload
    const coverImage = await uploadImage(
      await toUploadFile(coverFile),
      "brilson/product-covers"
    );
    uploadedImageIds.push(coverImage._id);

    // Product images upload (fail hui to uploadImages khud rollback karta hai)
    const uploadFiles = await Promise.all(files.map(toUploadFile));

    const uploadedImages = await uploadImages(uploadFiles, "brilson/products");
    uploadedImages.forEach((img) => uploadedImageIds.push(img._id));


    const featureList = features ? JSON.parse(features) : [];
    const metaTagList = metaTags ? JSON.parse(metaTags) : [];

    const product = await ProductModel.create({
      category,
      title,
      badge: badge || "",
      description,
      images: uploadedImages.map((img) => img._id),
      coverImg: coverImage._id,
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
      shipping: {
        enabled: shippingEnabled === "true",
        charge: Number(shippingCharge) || 0
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

    if (uploadedImageIds.length > 0) {
      try {
        await deleteImages(uploadedImageIds);
      } catch (cleanupError) {
        console.error("Image cleanup failed:", cleanupError);
      }
    }

    if (err instanceof SyntaxError) {
      return res.status(400).json({
        error: "Invalid JSON format in features or metaTags"
      });
    }

    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error"
    });

  }
};



const editProduct = async (req, res) => {
  const newUploadedIds = [];

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
      shippingEnabled,
      shippingCharge,
      discountEnabled,
      discountType,
      discountValue,
      existingImages,
      removedImages,
      features,
      metaTags,
      croppedImagesMapping
    } = req.body;

    const updatedData = { ...req.body };

    delete updatedData.coverImgId;
    delete updatedData.existingImages;
    delete updatedData.removedImages;
    delete updatedData.croppedImagesMapping;

    const oldCoverId = existingProduct.coverImg
      ? String(existingProduct.coverImg)
      : null;
    const oldImageIds = (existingProduct.images || []).map(String);
    const oldImageSet = new Set(oldImageIds);

    // COVER IMAGE UPDATE
    let finalCoverId = oldCoverId;

    if (req.files && req.files.coverImg) {
      const coverFile = Array.isArray(req.files.coverImg)
        ? req.files.coverImg[0]
        : req.files.coverImg;

      const newCover = await uploadImage(
        await toUploadFile(coverFile),
        "brilson/product-covers"
      );
      newUploadedIds.push(newCover._id);
      finalCoverId = String(newCover._id);
    }

    updatedData.coverImg = finalCoverId;

    // IMAGE UPDATE LOGIC
    let finalImages = [];

    // Parse existing images 
    const existingImagesArray = parseJSON(existingImages, []).map(String);

    // Parse removed images
    const removedImagesArray = parseJSON(removedImages, []).map(String);

    // Parse cropped images mapping
    const croppedMapping = parseJSON(croppedImagesMapping, []);

    finalImages.push(
      ...existingImagesArray.filter((id) => oldImageSet.has(id))
    );

    // Handle cropped images
    if (req.files && req.files.croppedImages) {
      let croppedFiles = req.files.croppedImages;

      if (!Array.isArray(croppedFiles)) {
        croppedFiles = [croppedFiles];
      }

      for (let i = 0; i < croppedMapping.length; i++) {
        const mapping = croppedMapping[i];
        const croppedFile = croppedFiles[i];
        const originalId = mapping?.originalId ? String(mapping.originalId) : null;

        if (croppedFile && originalId) {
          const newImage = await uploadImage(
            await toUploadFile(croppedFile),
            "brilson/products"
          );
          newUploadedIds.push(newImage._id);

          const index = finalImages.findIndex((id) => id === originalId);
          if (index !== -1) {
            finalImages[index] = String(newImage._id);
          } else if (!removedImagesArray.includes(originalId)) {
            finalImages.push(String(newImage._id));
          }
        }
      }
    }

    // Handle new image uploads
    if (req.files && req.files.images) {
      let files = req.files.images;

      if (!Array.isArray(files)) {
        files = [files];
      }

      for (const file of files) {
        const newImage = await uploadImage(
          await toUploadFile(file),
          "brilson/products"
        );
        newUploadedIds.push(newImage._id);
        finalImages.push(String(newImage._id));
      }
    }

    if (removedImagesArray.length > 0) {
      finalImages = finalImages.filter((id) => !removedImagesArray.includes(id));
    }

    updatedData.images = finalImages;

    // FEATURES
    updatedData.features = features
      ? parseJSON(features, existingProduct.features)
      : existingProduct.features;

    // META TAGS
    updatedData.metaTags = metaTags
      ? parseJSON(metaTags, existingProduct.metaTags)
      : existingProduct.metaTags;

    // GST
    updatedData.gst = {
      enabled: gstEnabled == "true",
      rate: Number(gstRate) || existingProduct.gst?.rate || 18
    };
    updatedData.shipping = {
      enabled: shippingEnabled === "true",
      charge: Number(shippingCharge) || existingProduct.shipping?.charge || 0
    };

    // DISCOUNT
    updatedData.discount = {
      enabled: discountEnabled === "true",
      type: discountType || existingProduct.discount?.type || "percentage",
      value: Number(discountValue) || existingProduct.discount?.value || 0
    };

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    const finalSet = new Set([finalCoverId, ...finalImages]);
    const idsToDelete = [
      ...(oldCoverId ? [oldCoverId] : []),
      ...oldImageIds
    ].filter((id) => !finalSet.has(id));

    if (idsToDelete.length > 0) {
      try {
        const deleteResult = await deleteImages(idsToDelete);
        if (deleteResult.failedCount > 0) {
          console.log("Some old images not deleted:", deleteResult.failed);
        }
      } catch (cleanupError) {
        console.log("Old image cleanup failed:", cleanupError);
      }
    }

    const populatedProduct = await ProductModel.findById(updatedProduct._id)
      .populate("coverImg", "secureUrl publicId")
      .populate({
        path: "images",
        match: { isDeleted: 0 },
        select: "secureUrl publicId"
      });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: populatedProduct
    });

  } catch (err) {
    console.error("Edit Product Error:", err);

    if (newUploadedIds.length > 0) {
      try {
        await deleteImages(newUploadedIds);
      } catch (cleanupError) {
        console.error("New image cleanup failed:", cleanupError);
      }
    }

    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error"
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndUpdate(id, { isDeleted: 1 }, { new: true });


    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      success: true
    });

  } catch (err) {
    console.log("Error in deleteProduct:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const findProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await ProductModel.findById(id).populate({
      path: "images",
      match: { isDeleted: 0 },
      select: "secureUrl fileName",
    }).populate({
      path: "coverImg",
      match: { isDeleted: 0 },
      select: "secureUrl fileName",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Found",
      product,
    });

  } catch (err) {
    console.log("Error in Find Product By Id:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getAllProduct = async (req, res) => {
  try {
    const { isDelete } = req.query;
    const allProducts = await ProductModel.find({ isDeleted: { $ne: 1 } }).populate({
      path: "images",
      match: { isDeleted: 0 },
      select: "secureUrl fileName",
    }).populate({
      path: "coverImg",
      match: { isDeleted: 0 },
      select: "secureUrl fileName",
    }).sort({ createdAt: -1 });

    res.status(200).json({ message: "All Products", allProducts });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
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
