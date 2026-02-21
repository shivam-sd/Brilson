const resumeModel = require("../../models/ProfileModel/ProfileResume");
const CardProfile = require("../../models/CardProfile");
const cloudinary = require("cloudinary").v2;



const addResume = async (req,res) => {
    try{
        const {activationCode} = req.body;

        const userId = req?.user;

        const card = await CardProfile.findOne({activationCode});

         if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const file = req?.files?.resume;
    console.log(file)

    if(!file){
         return res.status(400).json({ message: "Resume file is required" });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type:"raw",
        use_filename: true,
      overwrite: true,
        folder:"Profile Resume"
    });


    const resume = await resumeModel.create({
        cardId:card._id,
        activationCode:activationCode,
        owner:userId,
        resume:result.secure_url,
        name:file?.name
    });


    res.status(201).json({success:true, resume});


    }catch(err){
        res.status(500).json({error:err});
    }
}






const updateResume = async (req,res) => {
    try{
        const {resumeId} = req.params;


        const resume = await resumeModel.findById(resumeId);

         if (!resume) {
      return res.status(404).json({ message: "Resume Not Found!" });
    }

    const file = req?.files?.resume;

    if(!file){
         return res.status(400).json({ message: "Resume file is required" });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type:"raw",
        use_filename: true,
      overwrite: true,
        folder:"Profile Resume"
    });


  if(file) resume.resume = result?.secure_url  || resume?.resume
  resume.name = file?.name;

  await resume.save();


    res.status(201).json({success:true, resume});


    }catch(err){
        res.status(500).json({error:err});
    }
}





const getResume = async (req,res) => {
    try{
        const {activationCode} = req.params;

        const resume = await resumeModel.findOne({activationCode});

        if(!resume){
            return res.status(404).json({error:"Resume Not Found"});
        }

        res.status(200).json({success:true, resume});

    }catch(err){
        res.status(500).json({error:err || "Intenal Server Error"});
    }
}




module.exports = {
    addResume,
    updateResume,
    getResume
}