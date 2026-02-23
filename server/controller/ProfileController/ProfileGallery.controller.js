const profileGalleryModel = require("../../models/ProfileModel/ProfileGalleryModel");
const cloudinary = require("cloudinary").v2;
const CardProfileModel = require("../../models/CardProfile");


const addProfileGallery = async (req, res) => {
    try{
        const {activationCode, title, description} = req.body;

        const userId = req.user;
        
        // find card 
        const card = await CardProfileModel.findOne({activationCode});
        
        if(!card){
            return res.status(404).json({error:"card not found!"});
        }
        
        let imageUrl = '';
        
        const allowdFormate = ["image/jpeg", "image/jpg", "image/png", "image/svg", "image/gif", "image/webp"];
        
        const file = req.files?.image;

        if(file){
            if(!allowdFormate.includes(file.mimetype)){
                return res.status(400).json({message: "Only JPEG, PNG, JPG, GIF, and WEBP formats are allowed"});
            }
        }


        // image upload

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "brilson/profile-Gallery"
        });

        imageUrl = result.secure_url;

        const gallery = await profileGalleryModel.create({
            cardId:card._id,
            owner:userId,
            activationCode,
            title,
            description,
            image:imageUrl
        });


        res.status(201).json({message:"Gallery Created!", gallery});


    }catch(err){
        res.status(500).json({ error: "Failed to add profile gallery" });
        console.log(err);
    }
}


const updateGallery = async (req, res) => {
  try {
    const { galleryId } = req.params; 
    const { title, description } = req.body;

    // Find gallery
    const gallery = await profileGalleryModel.findById(galleryId);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found!" });
    }

    let imageUrl = gallery.image; 

    // Allowed formats
    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp",
    ];

    const file = req.files?.image;

    // If new image uploaded
    if (file) {
      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Only JPEG, PNG, JPG, GIF, SVG and WEBP allowed",
        });
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "brilson/profile-Gallery",
        }
      );

      imageUrl = result.secure_url;
    }

    // Update fields
    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;
    gallery.image = imageUrl;

    await gallery.save();

    res.json({
      success: true,
      message: "Gallery updated successfully",
      data: gallery,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gallery update error",
      error: err.message,
    });
  }
};



const getGallery = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const Gallery = await profileGalleryModel.find({ activationCode }).sort({createdAt: -1});

    if (!Gallery.length) {
      return res.status(404).json({ message: "No Gallery found for this activation code" });
    }
    // console.log("Gallery found:", Gallery);

    res.json({
      success: true,
      count: Gallery.length,
      data: Gallery,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSingleGallery = async (req,res) => {
    try{
     const { galleryId } = req.params;
        const gallery = await profileGalleryModel.findById(galleryId);
        if (!gallery) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            success: true,
            data: gallery
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
}


const deleteGallery = async(req,res) => {
    try{
        const {galleryId} = req.params;

        const gallery = await profileGalleryModel.findByIdAndDelete(galleryId);

if(!gallery){
    return res.status(404).json({ message: "Gallery not found" });
}


res.json({
    success:true,
    message:"Gallery Deleted"
})


    }catch(err){
        res.status(500).json({error:"Intenal Server Error"});
    }
}



module.exports = {
    addProfileGallery,
    updateGallery,
    getGallery,
    getSingleGallery,
    deleteGallery
}