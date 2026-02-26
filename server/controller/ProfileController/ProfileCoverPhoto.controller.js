const profileCoverPhotoModel = require("../../models/ProfileModel/ProfileCover.model");
const cloudinary = require("cloudinary").v2;


const addProfileCoverPhoto = async (req,res) => {
    try{
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
      folder: "brilson/profile-cover-photo",
    });

    // Check if already exists
    const existing = await profileCoverPhotoModel.findOne({ activationCode });

    if (existing) {
      return res.status(400).json({
        message: "Profile Cover already exists. Use update API.",
      });
    }

    // Create new
    const profileLogo = await profileCoverPhotoModel.create({
      activationCode,
      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Profile Cover Photo added",
      profileLogo,
    });
    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
        console.log("Profile Photo Cover", err);
    };
}






const updateProfileCover = async (req, res) => {
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
      { folder: "brilson/profile-cover-photo" }
    );

    // Check if logo exists
    const existingLogo = await profileCoverPhotoModel.findOne({ activationCode });

    let profileLogo;

    if (existingLogo) {
      // Update
      existingLogo.image = result.secure_url;
      profileLogo = await existingLogo.save();
    } else {
      // Create new
      profileLogo = await profileCoverPhotoModel.create({
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
      error: "Profile cover update error",
    });
  }
};




const getProfileCover = async (req,res) => {
    try{
        const {activationCode} = req.params;

        const profileLogo = await profileCoverPhotoModel.findOne({activationCode});

        if(!profileLogo){
            return res.status(404).json({message:"Profile Cover Not Found!"});
        }

        res.status(200).json({success:true, profileLogo});

    }catch(err){
        res.status(500).json({error:"Internal Server Error Fetching Profile Cover"});
        console.log(err)
    }
}



module.exports = {
    addProfileCoverPhoto,
    updateProfileCover,
    getProfileCover
}