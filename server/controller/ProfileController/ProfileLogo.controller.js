const profileLogoModel = require("../../models/ProfileModel/ProfileLogo.Model");
const cloudinary = require("cloudinary").v2;


const updateProfileLogo = async(req,res) => {
    try{
        const {activationCode} = req.body;
        let imageUrl = '';
        const file = req.files.image;

        if(file){
            const allowdFormates = ["image/jpg", "image/jpeg", "image/png", "image/svg", "image/webp"];

            if(!allowdFormates.includes(file.mimetype)){
              return res.status(400).json({message: "Only JPEG, PNG, JPG, and WEBP formats are allowed"});
            }
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder:"brilson/profile-logo"
        });

        imageUrl = result.secure_url;


        const profileLogo = await profileLogoModel.findOneAndUpdate(
            {}, 
        {image:imageUrl, activationCode:activationCode}, {
            new:true, upsert:true
        }
    );


    res.status(201).json({success:true, profileLogo});


    }catch(err){
        res.status(500).json({error:"Internal Server Error Profile Logo uploading"});
    }
}



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



module.exports = {updateProfileLogo, getProfileLogo}