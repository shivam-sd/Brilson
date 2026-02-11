const profileLogoModel = require("../../models/ProfileModel/ProfileLogo.Model");
const cloudinary = require("cloudinary").v2;



const addProfileLogo = async (req, res) => {
  try {
    const { activationCode } = req.body;

    if (!activationCode) {
      return res.status(400).json({ message: "Activation code required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const file = req.files.image;

    // Validate format
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Only JPEG, PNG, JPG, SVG, WEBP allowed",
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "brilson/profile-logo",
    });

    // Check if already exists
    const existing = await profileLogoModel.findOne({ activationCode });

    if (existing) {
      return res.status(400).json({
        message: "Profile logo already exists. Use update API.",
      });
    }

    // Create new
    const profileLogo = await profileLogoModel.create({
      activationCode,
      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Profile logo added",
      profileLogo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error while adding profile logo",
    });
  }
};




// const updateProfileLogo = async (req, res) => {
//   try {
//     const { activationCode } = req.body;

//     if (!activationCode) {
//       return res.status(400).json({ message: "Activation code required" });
//     }

//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ message: "Image required" });
//     }

//     const file = req.files.image;

//     const allowedFormats = [
//       "image/jpg",
//       "image/jpeg",
//       "image/png",
//       "image/svg+xml",
//       "image/webp",
//     ];

//     if (!allowedFormats.includes(file.mimetype)) {
//       return res.status(400).json({
//         message: "Only JPEG, PNG, JPG, WEBP allowed",
//       });
//     }

//     // Upload
//     const result = await cloudinary.uploader.upload(
//       file.tempFilePath,
//       { folder: "brilson/profile-logo" }
//     );

   
//     const profileLogo = await profileLogoModel.findOneAndUpdate(
//       { activationCode },
//       {
//         image: result.secure_url,
//         activationCode,
//       },
//       {
//         new: true,
//         upsert: true,
//       }
//     );

//     res.status(200).json({
//       success: true,
//       profileLogo,
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: "Profile logo update error",
//     });
//   }
// };



const updateProfileLogo = async (req, res) => {
  try {
    const { activationCode } = req.body;

    if (!activationCode) {
      return res.status(400).json({ message: "Activation code required" });
    }

    const file = req.files?.image;
    // if (!file) {
    //   return res.status(400).json({ message: "Image required" });
    // }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "brilson/profile-logo" }
    );

    // Check if logo exists
    const existingLogo = await profileLogoModel.findOne({ activationCode });

    let profileLogo;

    if (existingLogo) {
      // Update
      existingLogo.image = result.secure_url;
      profileLogo = await existingLogo.save();
    } else {
      // Create new
      profileLogo = await profileLogoModel.create({
        activationCode,
        image: result.secure_url,
      });
    }

    res.json({
      success: true,
      profileLogo,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Profile logo update error",
    });
  }
};





const getProfileLogo = async (req,res) => {
    try{
        const {activationCode} = req.params;

        const profileLogo = await profileLogoModel.findOne({activationCode});

        if(!profileLogo){
            return res.status(404).json({message:"Profile Logo Not Found!"});
        }

        res.status(200).json({success:true, profileLogo});

    }catch(err){
        res.status(500).json({error:"Internal Server Error Fetching Profile Logo"});
        console.log(err)
    }
}



module.exports = {addProfileLogo, updateProfileLogo, getProfileLogo}