const howToUseModel = require("../../models/LandingPage/HowToUse.model");
const cloudinary = require("cloudinary").v2;


const createHowToUse = async (req, res) => {
  try {
    const { heading, subHeading, steps } = req.body;

    let parsedSteps = JSON.parse(steps || "[]");

    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/svg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    parsedSteps = await Promise.all(
      parsedSteps.map(async (step, index) => {
        let guideUrl = "";

        const file = req.files?.[`guide[${index}]`];

        if (file) {
          if (!allowedFormats.includes(file.mimetype)) {
            throw new Error("Invalid file type (image/video only)");
          }

          const upload = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
              folder: "brilson/how-to-use",
              resource_type: file.mimetype.startsWith("video")
                ? "video"
                : "image",
            }
          );

          guideUrl = upload.secure_url;
        }

        return {
          title: step.title,
          description: step.description,
          guide: guideUrl,
        };
      })
    );

    const created = await howToUseModel.create({
      heading,
      subHeading,
      steps: parsedSteps,
    });

    res.status(201).json({
      success: true,
      message: "How To Use section created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Create HowToUse Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const updateHowToUse = async (req, res) => {
  try {
    const { heading, subHeading, steps } = req.body;

    let parsedSteps = JSON.parse(steps || "[]");

    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/svg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    parsedSteps = await Promise.all(
      parsedSteps.map(async (step, index) => {
        let guideUrl = step.guide || "";

        const file = req.files?.[`guide[${index}]`];

        if (file) {
          if (!allowedFormats.includes(file.mimetype)) {
            throw new Error("Invalid file type (image/video only)");
          }

          const upload = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
              folder: "brilson/how-to-use",
              resource_type: file.mimetype.startsWith("video")
                ? "video"
                : "image",
            }
          );

          guideUrl = upload.secure_url;
        }

        return {
          title: step.title,
          description: step.description,
          guide: guideUrl,
        };
      })
    );

    const updated = await howToUseModel.findOneAndUpdate(
      {},
      {
        heading,
        subHeading,
        steps: parsedSteps,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "How To Use section not found",
      });
    }

    res.json({
      success: true,
      message: "How To Use section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update HowToUse Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const getHowToUse = async (req, res) => {
  try {
    const data = await howToUseModel.findOne();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "How To Use section not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get HowToUse Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





module.exports = {
    createHowToUse,
    updateHowToUse,
    getHowToUse
}