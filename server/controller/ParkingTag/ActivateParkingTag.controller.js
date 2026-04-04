const ParkingTagModel = require("../../models/AddParkingTag.model");
const generateSlug = require("../../utils/generateSlug");
const UserModel = require("../../models/User.model");  



/*  ACTIVATE PARKING TAG  */

// for the single account activate single parking tag

// const ActivateParkingTagAPi = async (req, res) => {
//   try {
//     const userId = req.user; 
//     const { activationCode } = req.body;

//     if (!activationCode) {
//       return res.status(400).json({
//         error: "activation code required",
//       });
//     }

//     /*  FIND CARD */
//     const tag = await ParkingTagModel.findOne({ activationCode });

//     if (!tag) {
//       return res.status(400).json({
//         error: "Invalid Parking Tag details",
//       });
//     }

//     /* ALREADY ACTIVATED  */
//     if (tag.isActivated) {
//       return res.status(403).json({
//         error: "This Parking Tag is already activated",
//         slug: tag.slug,
//       });
//     }

//     /*  USER EXISTS */
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     const existingTag = await ParkingTagModel.findOne({
//       owner:userId,
//       isActivated:true
//     });

//     if(existingTag){
//       return res.status(403).json({error:"you can activate only one parking tag per account! Please use another account to activate more parking tags."});
//     }


//     /*  ACTIVATE PARKING TAG */
//     tag.isActivated = true;
//     tag.owner = userId; 
//     tag.activatedAt = new Date();
//     tag.tempSessionId = generateSlug(activationCode + Date.now());

//     /*  GENERATE UNIQUE SLUG */
//     tag.slug = activationCode;

//     await tag.save();

//     /*  ADD TAG TO USER (NO DUPLICATE) */
//     await UserModel.findByIdAndUpdate(
//       userId,
//       { $addToSet: { myParkingTags: tag._id } },
//       { new: true }
//     );

//     /*  FINAL RESPONSE */
//     return res.status(200).json({
//       message: "Parking Tag activated successfully",
//       activationCode: tag.activationCode,
//       slug: tag.slug,
//     });

//   } catch (err) {
//     console.error("Activate Parking Tag Error:", err);
//     return res.status(500).json({
//       error: "Server error",
//     });
//   }
// };


// for multiple parking tag activate single account code

const ActivateParkingTagAPi = async (req, res) => {
  try {
    const userId = req.user; 
    const { activationCode } = req.body;

    if (!activationCode) {
      return res.status(400).json({
        error: "activation code required",
      });
    }

    /*  FIND CARD */
    const tag = await ParkingTagModel.findOne({ activationCode });

    if (!tag) {
      return res.status(400).json({
        error: "Invalid Parking Tag details",
      });
    }

    /* ALREADY ACTIVATED  */
    if (tag.isActivated) {
      return res.status(403).json({
        error: "This Parking Tag is already activated",
        slug: tag.slug,
      });
    }

    /*  USER EXISTS */
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }


    /*  ACTIVATE PARKING TAG */
    tag.isActivated = true;
    tag.owner = userId; 
    tag.activatedAt = new Date();
    tag.tempSessionId = generateSlug(activationCode + Date.now());

    /*  GENERATE UNIQUE SLUG */
    tag.slug = activationCode;

    await tag.save();

    /*  ADD TAG TO USER (NO DUPLICATE) */
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myParkingTags: tag._id } },
      { new: true }
    );

    /*  FINAL RESPONSE */
    return res.status(200).json({
      message: "Parking Tag activated successfully",
      activationCode: tag.activationCode,
      slug: tag.slug,
    });

  } catch (err) {
    console.error("Activate Parking Tag Error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};





const EditParkingTagProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const updateFields = {};

    // convert body  nested profile updates
    Object.keys(req.body).forEach((key) => {
      updateFields[`profile.${key}`] = req.body[key];
    });

    const card = await CardProfileModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(403).json({
        error: "You are not allowed to edit this profile",
      });
    }

    res.json({
      message: "Profile updated successfully",
      card,
    });

  } catch (err) {
    console.log("Error in Edit Card Profile", err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};





// const updateCountryCode = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user;
//     const { countryCode } = req.body;

//     const updatedProfile = await CardProfileModel.findByIdAndUpdate(
//       {_id:id, owner:userId},
//       {
//         $set: {
//           "profile.countryCode": countryCode,
//         },
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Country code updated successfully",
//       data: updatedProfile,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };




// const updateWaCountryCode = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user;
//     const { WacountryCode } = req.body;

//     const updatedProfile = await CardProfileModel.findByIdAndUpdate(
//       {_id:id, owner:userId},
//       {
//         $set: {
//           "profile.WacountryCode": WacountryCode,
//         },
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Country code updated successfully",
//       data: updatedProfile,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


module.exports = {ActivateParkingTagAPi, EditParkingTagProfile};
