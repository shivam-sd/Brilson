const ProfileService = require("../../models/ProfileModel/ProfileServices.Model");
const CardProfile = require("../../models/CardProfile");
const ProfileProductModel = require("../../models/ProfileModel/ProfileProduct.Model");
const ProfileGalleryModel = require("../../models/ProfileModel/ProfileGalleryModel");
const locationModel = require("../../models/ProfileModel/Location&Reviews.model");
const PaymentDetailsModel = require("../../models/ProfileModel/PaymentDetails.Model");
const resumeModel = require("../../models/ProfileModel/ProfileResume");
const { uploadImage, deleteImage } = require("../../services/image.service");
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

    let imageId = null;

    const file = req.files?.image;

    if (file) {
      const uploadedImage = await uploadImage(
        file,
        "brilson/profile-services"
      );

      imageId = uploadedImage._id;
    }

    const service = await ProfileService.create({
      cardId: card._id,
      owner: userId,
      activationCode,
      title,
      description,
      features: JSON.parse(features || "[]"),
      price,
      image: imageId,
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

    if (features) {
      service.features =
        typeof features === "string"
          ? JSON.parse(features)
          : features;
    }

    const file = req.files?.image;
    console.log("Received file:----", file);

    if (file) {
      const oldImageId = service.image;

      const uploadedImage = await uploadImage(
        file,
        "brilson/profile-services"
      );

      service.image = uploadedImage._id;

      try {
        if (oldImageId) {
          await deleteImage(oldImageId);
        }
      } catch (deleteError) {
        console.log("Old service image delete error:", deleteError);
      }
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

    const services = await ProfileService.find({ activationCode }).populate({
      path: "image",
      match: { isDeleted: 0 },
      select: "secureUrl fileName ",
    }).sort({ createdAt: -1 });
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
  try {
    const { serviceId } = req.params;

    const service = await ProfileService.findById(serviceId).populate({
      path: "image",
      match: { isDeleted: 0 },
      select: "secureUrl fileName ",
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      data: service,
    })

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}




const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await ProfileService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const imageId = service.image;

    await ProfileService.findByIdAndDelete(serviceId);

    if (imageId) {
      await deleteImage(imageId);
    }

    res.json({
      success: true,
      message: "Service deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getSectionAvailability = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const [
      galleryCount,
      productsCount,
      servicesCount,
      locationReviews,
      paymentDetails,
      resume,
    ] = await Promise.all([
      ProfileGalleryModel.countDocuments({ activationCode }),
      ProfileProductModel.countDocuments({ activationCode }),
      ProfileService.countDocuments({ activationCode }),
      locationModel.findOne({ activationCode }).select("_id").lean(),
      PaymentDetailsModel.findOne({ activationCode }).select("_id").lean(),
      resumeModel.findOne({ activationCode }).select("_id").lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        gallery: galleryCount > 0,
        products: productsCount > 0,
        services: servicesCount > 0,
        location: Boolean(locationReviews),
        payment: Boolean(paymentDetails),
        resume: Boolean(resume),
      },
    });
  } catch (err) {
    console.error("getSectionAvailability error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

module.exports = {
  addService,
  updateService,
  getServices,
  getSingleService,
  deleteService,
  getSectionAvailability,
};