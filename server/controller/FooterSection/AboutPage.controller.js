const AboutPageModel = require("../../models/FooterSection.jsx/AboutPageModel.model");
const cloudinary = require("cloudinary").v2;

// allowed formats
const fs = require("fs");

const allowedFormats = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const uploadImage = async (file, folder) => {
  if (!file) return null;

  if (!allowedFormats.includes(file.mimetype)) {
    throw new Error("Invalid image format");
  }

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
  });

  fs.unlinkSync(file.tempFilePath);

  return result.secure_url;
};

const createOrUpdateAboutPage = async (req, res) => {
  try {
    let payload = req.body.data
      ? JSON.parse(req.body.data)
      : req.body;

    let existing = await AboutPageModel.findOne();

    // ===== STATS =====
    if (payload.stats?.length) {
      const files = req.files?.statsImages
        ? Array.isArray(req.files.statsImages)
          ? req.files.statsImages
          : [req.files.statsImages]
        : [];

      for (let i = 0; i < payload.stats.length; i++) {
        if (files[i]) {
          payload.stats[i].image = await uploadImage(
            files[i],
            "brilson/about/stats"
          );
        } else if (existing?.stats?.[i]?.image) {
          payload.stats[i].image = existing.stats[i].image;
        }
      }
    }

    // ===== JOURNEY =====
    if (payload.journey?.length) {
      const files = req.files?.journeyImages
        ? Array.isArray(req.files.journeyImages)
          ? req.files.journeyImages
          : [req.files.journeyImages]
        : [];

      for (let i = 0; i < payload.journey.length; i++) {
        if (files[i]) {
          payload.journey[i].image = await uploadImage(
            files[i],
            "brilson/about/journey"
          );
        } else if (existing?.journey?.[i]?.image) {
          payload.journey[i].image = existing.journey[i].image;
        }
      }
    }

    // ===== VALUES =====
    if (payload.values?.length) {
      const files = req.files?.valuesImages
        ? Array.isArray(req.files.valuesImages)
          ? req.files.valuesImages
          : [req.files.valuesImages]
        : [];

      for (let i = 0; i < payload.values.length; i++) {
        if (files[i]) {
          payload.values[i].image = await uploadImage(
            files[i],
            "brilson/about/values"
          );
        } else if (existing?.values?.[i]?.image) {
          payload.values[i].image = existing.values[i].image;
        }
      }
    }

    // ===== TEAM =====
    if (payload.team?.length) {
      const files = req.files?.teamImages
        ? Array.isArray(req.files.teamImages)
          ? req.files.teamImages
          : [req.files.teamImages]
        : [];

      for (let i = 0; i < payload.team.length; i++) {
        if (files[i]) {
          payload.team[i].image = await uploadImage(
            files[i],
            "brilson/about/team"
          );
        } else if (existing?.team?.[i]?.image) {
          payload.team[i].image = existing.team[i].image;
        }
      }
    }

    let about;

    if (existing) {
      about = await AboutPageModel.findByIdAndUpdate(
        existing._id,
        payload,
        { new: true }
      );
    } else {
      about = await AboutPageModel.create(payload);
    }

    res.status(200).json({
      success: true,
      message: "About page saved successfully",
      data: about,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};



const getAboutPage = async (req, res) => {
  try {
    const data = await AboutPageModel.findOne();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "About page data not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {
    console.log("Get About Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch about page",
    });
  }
};

module.exports = {
  createOrUpdateAboutPage,
  getAboutPage,
};



// const CreateOrUpdate = async(req, res) => {
//     try{
//         const payload = req.body;

//         const about = await AboutPageModel.findOne();

//         if(about){
//             const updateAbout = await AboutPageModel.findByIdAndUpdate(
//                 about._id,
//                 payload,
//             {new:true}
//             )
//         }

//         res.status(200).json({
//             success:true,
//             message:"About Page Updated Successfully",
//             data:payload,
//         });

//         const newAbout = await AboutPageModel.create(payload);

//         res.status(201).json({
//             success:true,
//             message:"About Page Created Successfully",
//             data:newAbout
//         });

//     }catch(err){
//         console.log("Create/Update Error:", err);
//         res.status(500).json({
//             success: false,
//             message: "Failed to save about page",
//         });
//     }
// }