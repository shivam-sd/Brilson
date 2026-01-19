const HomepageContentModel = require("../../models/LandingPage/HomepageContent.model");
const cloudinary = require("cloudinary").v2



const createHomepageContent = async (req, res) => {
  try {
    const {
      badgeText,
      headingPrimary,
      headingAccent,
      subHeading,
      highlight,
      features
    } = req.body;

    // Parse features
    let parsedFeatures = JSON.parse(features || "[]");

    // Images array
    const images = req.files?.images;

    // Allowed formats
    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    // Upload images & map with features
    parsedFeatures = await Promise.all(
      parsedFeatures.map(async (item, index) => {
        let imageUrl = "";

        if (images[index]) {
          if (!allowedFormats.includes(images[index].mimetype)) {
            throw new Error("Only image files are allowed");
          }

          const uploadResult = await cloudinary.uploader.upload(
            images[index].tempFilePath,
            { folder: "brilson/features" }
          );

          imageUrl = uploadResult.secure_url;
        }

        return {
          title: item.title,
          description: item.description,
          image: imageUrl
        };
      })
    );

    // Create document
    const homepageContent = await HomepageContentModel.create({
      heroSection: {
        badgeText,
        headingPrimary,
        headingAccent,
        subHeading,
        Highlight: highlight
      },
      featuresSection: {
        items: parsedFeatures
      }
    });

    return res.status(201).json({
      success: true,
      message: "Homepage content created successfully",
      data: homepageContent
    });

  } catch (err) {
    console.log("HomepageContent Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};



const updateHomepageContent = async (req, res) => {
  try {
    const {
      badgeText,
      headingPrimary,
      headingAccent,
      subHeading,
      highlight,
      features
    } = req.body;

    // Parse features safely
    let parsedFeatures = JSON.parse(features || "[]");

    // Ensure images is always an array
    let images = [];
    if (req.files && req.files.images) {
      images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
    }

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
        let imageUrl = item.image || "";

        
        if (images.length > 0 && images[index]) {
          if (!allowedFormats.includes(images[index].mimetype)) {
            throw new Error("Only image files are allowed");
          }

          const uploadResult = await cloudinary.uploader.upload(
            images[index].tempFilePath,
            { folder: "brilson/features" }
          );

          imageUrl = uploadResult.secure_url;
        }

        return {
          title: item.title,
          description: item.description,
          image: imageUrl
        };
      })
    );

    const updatedHomepage = await HomepageContentModel.findOneAndUpdate(
      {},
      {
        heroSection: {
          badgeText,
          headingPrimary,
          headingAccent,
          subHeading,
          Highlight: highlight
        },
        features: {
          items: parsedFeatures
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Homepage content updated successfully",
      data: updatedHomepage
    });

  } catch (error) {
    console.error("Update Homepage Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};






const getHomepageContent = async (req, res) => {
  try {
    const content = await HomepageContentModel.findOne();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
    createHomepageContent,
    updateHomepageContent,
    getHomepageContent
}