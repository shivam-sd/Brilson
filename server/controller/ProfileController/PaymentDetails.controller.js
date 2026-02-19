const PaymentDetailsModel = require("../../models/ProfileModel/PaymentDetails.Model");
const CardProfile = require("../../models/CardProfile");
const cloudinary = require("cloudinary").v2;


const addPaymentDetails = async (req, res) => {
  try {
    const { activationCode, upi } = req.body;
    let { paymentDetails } = req.body;

    const userId = req.user;

    // FIND CARD
    const card = await CardProfile.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Prevent duplicate payment details for same card
    const existing = await PaymentDetailsModel.findOne({
      cardId: card._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Payment details already added for this card",
      });
    }

    // Parse paymentDetails safely
    if (paymentDetails && typeof paymentDetails === "string") {
      paymentDetails = JSON.parse(paymentDetails);
    }

    let imageUrl = "";

    // IMAGE UPLOAD (OPTIONAL)
    const file = req.files?.image;

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message:
            "Only JPEG, PNG, JPG, GIF, and WEBP formats are allowed",
        });
      }

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "brilson/profile-payment",
        }
      );

      imageUrl = result.secure_url;
    }

    // CREATE PAYMENT
    const payment = await PaymentDetailsModel.create({
      cardId: card._id,
      owner: userId,
      activationCode,
      upi,
      paymentDetails,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};







const updatePaymentDetails = async (req, res) => {
  try {
    const { upi } = req.body;
    let { paymentDetails } = req.body;

    const {paymentId} = req.params;


    // Find existing payment details
    const payment = await PaymentDetailsModel.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment details not found",
      });
    }

    // Parse paymentDetails safely
    if (paymentDetails && typeof paymentDetails === "string") {
      paymentDetails = JSON.parse(paymentDetails);
    }

    let imageUrl = payment.image; 

    const file = req.files?.image;

    if (file) {
      const allowedFormats = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message:
            "Only JPEG, PNG, JPG, GIF, and WEBP formats are allowed",
        });
      }

      // Delete old image from Cloudinary (if exists)
      // if (payment.image) {
      //   const publicId = payment.image
      //     .split("/")
      //     .slice(-2)
      //     .join("/")
      //     .split(".")[0];

      //   await cloudinary.uploader.destroy(publicId);
      // }


      // Upload new image
      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "brilson/profile-payment",
        }
      );

      imageUrl = result.secure_url;
    }

    // Update fields 
    payment.upi = upi ?? payment.upi;
    payment.paymentDetails =
      paymentDetails ?? payment.paymentDetails;
    payment.image = imageUrl;

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};




const getPaymentDetails = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const paymentDetails = await PaymentDetailsModel.findOne({activationCode});

    res.status(200).json({
      success: true,
      data: paymentDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};


module.exports = {
  addPaymentDetails,
  updatePaymentDetails,
  getPaymentDetails
}



