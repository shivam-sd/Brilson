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
        let imageUrl = item.image;

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

    const updated = await PowerfulFeatures.findOneAndUpdate(
      {},
      {
        subHeading,
        features: parsedFeatures,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Powerful features not found",
      });
    }

    res.json({
      success: true,
      message: "Powerful features updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("Update Powerful Features Error:", error);
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
