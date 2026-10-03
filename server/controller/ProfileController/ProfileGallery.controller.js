const profileGalleryModel = require("../../models/ProfileModel/ProfileGalleryModel");
const CardProfileModel = require("../../models/CardProfile");
const { uploadImage, deleteImage } = require("../../services/image.service");


const addProfileGallery = async (req, res) => {
  try {
    const { activationCode } = req.body;
    const userId = req.user;

    const card = await CardProfileModel.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({
        error: "card not found!",
      });
    }

    const file = req.files?.image;

    if (!file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const uploadedImage = await uploadImage(
      file,
      "brilson/profile-Gallery"
    );

    try {
      const gallery = await profileGalleryModel.create({
        cardId: card._id,
        owner: userId,
        activationCode,
        image: uploadedImage._id,
      });

      return res.status(201).json({
        success: true,
        message: "Gallery Created!",
        gallery,
      });
    } catch (error) {
      await deleteImage(uploadedImage._id);
      throw error;
    }
  } catch (err) {
    console.log(err);

    res.status(err.statusCode || 500).json({
      error: err.message || "Failed to add profile gallery",
    });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { galleryId } = req.params;

    const gallery = await profileGalleryModel.findById(galleryId);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found!",
      });
    }

    const file = req.files?.image;

    if (file) {
      const oldImageId = gallery.image;

      const uploadedImage = await uploadImage(
        file,
        "brilson/profile-Gallery"
      );

      gallery.image = uploadedImage._id;

      try {
        await gallery.save();
      } catch (error) {
        await deleteImage(uploadedImage._id);
        throw error;
      }

      if (oldImageId) {
        try {
          await deleteImage(oldImageId);
        } catch (deleteError) {
          console.log(
            "Old gallery image delete error:",
            deleteError
          );
        }
      }
    } else {
      await gallery.save();
    }

    res.json({
      success: true,
      message: "Gallery updated successfully",
      data: gallery,
    });
  } catch (err) {
    console.error(err);

    res.status(err.statusCode || 500).json({
      message: err.message || "Gallery update error",
    });
  }
};

const getGallery = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const Gallery = await profileGalleryModel
      .find({ activationCode })
      .populate({
        path: "image",
        match: { isDeleted: 0 },
        select: "secureUrl fileName",
      })
      .sort({ createdAt: -1 });

    if (!Gallery.length) {
      return res.status(404).json({
        message: "No Gallery found for this activation code",
      });
    }

    res.json({
      success: true,
      count: Gallery.length,
      data: Gallery,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getSingleGallery = async (req, res) => {
  try {
    const { galleryId } = req.params;

    const gallery = await profileGalleryModel
      .findById(galleryId)
      .populate({
        path: "image",
        match: { isDeleted: 0 },
        select: "secureUrl fileName",
      });

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    res.json({
      success: true,
      data: gallery,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const { galleryId } = req.params;

    const gallery = await profileGalleryModel.findById(galleryId);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    const imageId = gallery.image;

    await profileGalleryModel.findByIdAndDelete(galleryId);

    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (deleteError) {
        console.log(
          "Gallery image delete error:",
          deleteError
        );
      }
    }

    res.json({
      success: true,
      message: "Gallery Deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: "Intenal Server Error",
    });
  }
};

module.exports = {
  addProfileGallery,
  updateGallery,
  getGallery,
  getSingleGallery,
  deleteGallery,
};