const cloudinary = require("cloudinary").v2;

const uploadInvoiceToCloudinary = async (filePath, invoiceNumber) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Invoices",
      public_id: invoiceNumber,
      resource_type: "raw",   // IMPORTANT FOR PDF
      use_filename: true,
      overwrite: true,
    });

    return {
      pdfUrl: result.secure_url,       // Direct downloadable URL
      cloudinaryId: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
};

module.exports = uploadInvoiceToCloudinary;
