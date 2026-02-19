const CardProfile = require("../../models/CardProfile");
const PortfolioModel = require("../../models/ProfileModel/ProfilePortfolio.Model");
const cloudinary = require("cloudinary").v2;

const addPortfolio = async (req, res) => {
  try {
    const { activationCode, title, description, duration } = req.body;
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
const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: "brilson/profile-portfolio" }
);

imageUrl = result.secure_url;


    const portfolio = await PortfolioModel.create({
      cardId: card._id,
      title,
      description,
      duration,
      image: imageUrl,
      owner: userId,
      activationCode
    });

    res.json({
      success: true,
      data: portfolio, 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updatePortfolio = async (req, res) => {

  try {
    const { portfolioId } = req.params;

    const portfolio = await PortfolioModel.findById(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }


    // Update fields
    const { title, description, duration } = req.body;

    if (title) portfolio.title = title;
    if (description) portfolio.description = description;
    if (duration) portfolio.duration = duration;

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
        { folder: "brilson/profile-portfolio" }
      );

      portfolio.image = result.secure_url;
    }

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio updated",
      data: portfolio,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSinglePortfolio = async (req,res) => {
    try{
        const { portfolioId } = req.params;
        const portfolio = await PortfolioModel.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        res.json({
            success: true,
            data: portfolio,    
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
}



const getPortfolio = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const Portfolio = await PortfolioModel.find({ activationCode }).sort({createdAt: -1});

    if (!Portfolio.length) {
      return res.status(404).json({ message: "No portfolios found for this activation code" });
    }
    console.log("Portfolios found:", Portfolio);

    res.json({
      success: true,
      count: Portfolio.length,
      data: Portfolio,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deletePortfolio = async (req, res) => {
  try{
    const { portfolioId } = req.params;
    const portfolio = await PortfolioModel.findByIdAndDelete(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json({
      success: true,
      message: "Portfolio deleted",
    });
  }catch(err){
    res.status(500).json({message: err.message});
  }
}


module.exports ={
    addPortfolio,
    updatePortfolio,
    getPortfolio,
    getSinglePortfolio,
    deletePortfolio
}