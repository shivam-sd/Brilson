const CardProfile = require("../../models/CardProfile");
const Product = require("../../models/ProfileModel/ProfileProduct.Model");
const cloudinary = require("cloudinary").v2;

const addProduct = async (req, res) => {
  try {
    const { activationCode, title, description, price } = req.body;
    const userId = req.user;

    // Find card
    const card = await CardProfile.findOne({ activationCode });
    console.log("Card found:", card);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // image upload
    let imageUrl = "";

    const file = req.files?.image;
    if(file){
        const allowedFromates = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
        if(!allowedFromates.includes(file.mimetype)){
            return res.status(400).json({message: "Only JPEG, PNG, JPG, GIF, and WEBP formats are allowed"});
        }
    }


// upload image to cloudinary
const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "brilson/profile-products" }
);

imageUrl = result.secure_url;


    const product = await Product.create({
      cardId: card._id,
      title,
      description,
      image: imageUrl,
      owner: userId,
      activationCode,
      price
    });

    res.json({
      success: true,
      data: product,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    // Update fields
    const { title, description, price } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if(price) product.price = price;

    // IMAGE UPDATE 
    if (req.files?.image) {
      const file = req.files.image;

      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format",
        });
      }

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brilson/profile-products" }
      );

      product.image = result.secure_url;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated",
      data: product,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSingleProduct = async (req,res) => {
    try{
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            success: true,
            data: product
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
}



const getProducts = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const Products = await Product.find({ activationCode }).sort({createdAt: -1});

    if (!Products.length) {
      return res.status(404).json({ message: "No products found for this activation code" });
    }
    console.log("Products found:", Products);

    res.json({
      success: true,
      count: Products.length,
      data: Products,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteProduct = async (req, res) => {
  try{
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product deleted",
    });
  }catch(err){
    res.status(500).json({message: err.message});
  }
}


module.exports ={
    addProduct,
    updateProduct,
    getProducts,
    getSingleProduct,
    deleteProduct
}