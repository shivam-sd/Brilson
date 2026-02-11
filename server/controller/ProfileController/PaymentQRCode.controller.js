const PaymentQrModel = require("../../models/ProfileModel/PaymentQRCode.Model");
const cloudinary = require("cloudinary").v2;


const updateQrCode = async (req, res) => {
  try {

    const file = req.files?.image;

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp",
    ];

    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Only JPEG, PNG, JPG, GIF, WEBP allowed",
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "brilson/payment-qr" }
    );

    // Update if exists, else create
    const paymentQr = await PaymentQrModel.findOneAndUpdate(
      { },
      {
          image: result.secure_url,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      paymentQr,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error Payment QR",
    });
  }
};


const getPaymentQr = async (req,res) => {
    try{
        const paymentqr = await PaymentQrModel.findOne();

        res.status(200).json({success:true, paymentqr});

    }catch(err){
        res.status(500).json({error:"Internal Server Error fetching payment qr"});
    }
}



module.exports = {getPaymentQr, updateQrCode};
