const ProfileService = require("../../models/ProfileModel/ProfileServices.Model");
const CardProfile = require("../../models/CardProfile");
const cloudinary = require("cloudinary").v2;


const addService = async (req, res) => {
  try {
    const userId = req.user;
    const {
      activationCode,
      title,
      description,
      features,
      price,
      link
    } = req.body;

    const card = await CardProfile.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    let imageUrl = "";

    const file = req.files?.image;

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format",
        });
      }

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brilson/profile-services" }
      );

      imageUrl = result.secure_url;
    }

    const service = await ProfileService.create({
      cardId: card._id,
      owner: userId,
      activationCode,
      title,
      description,
      features: JSON.parse(features || "[]"),
      price,
      image: imageUrl,
      link
    });

    res.status(201).json({
      success: true,
      data: service,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await ProfileService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const { title, description, features, price, link } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (price) service.price = price;
    if (link) service.link = link;

    // Parse features if string
    if (features) {
      service.features =
        typeof features === "string"
          ? JSON.parse(features)
          : features;
    }

    // IMAGE UPLOAD
    const file = req.files?.image;

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
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

      service.image = result.secure_url;
    }

    await service.save();

    res.json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getServices = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const services = await ProfileService
      .find({ activationCode })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getSingleService = async (req, res) => {
    try{
        const { serviceId } = req.params;

        const service = await ProfileService.findById(serviceId);

        if(!service){
            return res.status(404).json({message: "Service not found"});
        }

        res.json({
            success: true,
            data: service,
        })

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}



const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await ProfileService.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service deleted",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addService,
  updateService,
  getServices,
  getSingleService,
  deleteService,
};