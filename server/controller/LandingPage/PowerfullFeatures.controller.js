const PowerfulFeatures = require("../../models/LandingPage/PowerFullFeature");
const cloudinary = require("cloudinary").v2;


  // CREATE POWERFUL FEATURES

const createPowerfulFeatures = async (req, res) => {
  try {
    const { subHeading, features } = req.body;

    let parsedFeatures = JSON.parse(features || "[]");
    const images = req.files?.images || [];

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    parsedFeatures = await Promise.all(
      parsedFeatures.map(async (item, index) => {
        let imageUrl = "";

        if (images[index]) {
          if (!allowedFormats.includes(images[index].mimetype)) {
            throw new Error("Only image files are allowed");
          }

          const upload = await cloudinary.uploader.upload(
            images[index].tempFilePath,
            { folder: "brilson/powerful-features" }
          );

          imageUrl = upload.secure_url;
        }

        return {
          title: item.title,
          description: item.description,
          image: imageUrl,
        };
      })
    );

    const created = await PowerfulFeatures.create({
      subHeading,
      features: parsedFeatures,
    });

    res.status(201).json({
      success: true,
      message: "Powerful features created successfully",
      data: created,
    });
  } catch (error) {
    console.log("Create Powerful Features Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 //UPDATE POWERFUL FEATURES


const updatePowerfulFeatures = async (req, res) => {
  try {
    const { subHeading, features } = req.body;
    let parsedFeatures = JSON.parse(features || "[]");

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    const updatedFeatures = await Promise.all(
      parsedFeatures.map(async (item, index) => {
        let imageUrl = item.image;

        const file = req.files?.[`images[${index}]`];

        if (file) {
          if (!allowedFormats.includes(file.mimetype)) {
            throw new Error("Invalid image format");
          }

          const upload = await cloudinary.uploader.upload(
            file.tempFilePath || file.path,
            { folder: "brilson/powerful-features" }
          );

          imageUrl = upload.secure_url;
        }

        return {
          title: item.title,
          description: item.description,
          image: imageUrl,
        };
      })
    );

    const updated = await PowerfulFeatures.findOneAndUpdate(
      {},
      { subHeading, features: updatedFeatures },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Powerful features updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




   //GET POWERFUL FEATURES


const getPowerfulFeatures = async (req, res) => {
  try {
    const data = await PowerfulFeatures.findOne();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPowerfulFeatures,
  updatePowerfulFeatures,
  getPowerfulFeatures,
};
