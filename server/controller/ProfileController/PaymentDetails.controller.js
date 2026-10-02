const PaymentDetailsModel = require("../../models/ProfileModel/PaymentDetails.Model");
const CardProfile = require("../../models/CardProfile");
const {
  uploadImage,
  deleteImage,
} = require("../../services/image.service");

const addPaymentDetails = async (req, res) => {
  try {
    const { activationCode, upi } = req.body;
    let { paymentDetails } = req.body;

    const userId = req.user;

    const card = await CardProfile.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const existing = await PaymentDetailsModel.findOne({
      cardId: card._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Payment details already added for this card",
      });
    }

    if (paymentDetails && typeof paymentDetails === "string") {
      paymentDetails = JSON.parse(paymentDetails);
    }

    let imageId = null;

    const file = req.files?.image;

    if (file) {
      const uploadedImage = await uploadImage(
        file,
        "brilson/profile-payment"
      );

      imageId = uploadedImage._id;
    }

    try {
      const payment = await PaymentDetailsModel.create({
        cardId: card._id,
        owner: userId,
        activationCode,
        upi,
        paymentDetails,
        image: imageId,
      });

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      if (imageId) {
        await deleteImage(imageId);
      }

      throw error;
    }
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Server error",
    });
  }
};

const updatePaymentDetails = async (req, res) => {
  try {
    const { upi } = req.body;
    let { paymentDetails } = req.body;
    const { paymentId } = req.params;

    const payment = await PaymentDetailsModel.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment details not found",
      });
    }

    if (paymentDetails && typeof paymentDetails === "string") {
      paymentDetails = JSON.parse(paymentDetails);
    }

    const file = req.files?.image;

    if (file) {
      const oldImageId = payment.image;

      const uploadedImage = await uploadImage(
        file,
        "brilson/profile-payment"
      );

      payment.image = uploadedImage._id;

      try {
        await payment.save();
      } catch (error) {
        await deleteImage(uploadedImage._id);
        throw error;
      }

      if (oldImageId) {
        try {
          await deleteImage(oldImageId);
        } catch (deleteError) {
          console.log(
            "Old payment image delete error:",
            deleteError
          );
        }
      }
    } else {
      payment.upi = upi ?? payment.upi;
      payment.paymentDetails =
        paymentDetails ?? payment.paymentDetails;

      await payment.save();
    }

    if (file) {
      payment.upi = upi ?? payment.upi;
      payment.paymentDetails =
        paymentDetails ?? payment.paymentDetails;

      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      data: payment,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Server error",
    });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const paymentDetails = await PaymentDetailsModel.findOne({
      activationCode,
    }).populate({
      path: "image",
      match: { isDeleted: 0 },
      select: "secureUrl fileName",
    });

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
  getPaymentDetails,
};