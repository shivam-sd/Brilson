const TestimonialsModel = require("../../models/LandingPage/Testimonials");
const cloudinary = require("cloudinary").v2;

/*  CREATE  */
const createTestimonials = async (req, res) => {
  try {
    const { name, rating, review } = req.body;

    if (!name || !review) {
      return res.status(400).json({ message: "Name & Review required" });
    }

    let imgUrl = "";

    const file = req.files?.image;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if (file) {
      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Only JPG, JPEG, PNG, WEBP allowed",
        });
      }

      const upload = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brilson/testimonials" }
      );

      imgUrl = upload.secure_url;
    }

    const testimonial = await TestimonialsModel.create({
      name,
      review,
      rating: rating || 5,
      image: imgUrl,
    });

    res.status(201).json({
      success: true,
      testimonial,
    });
  } catch (err) {
    console.error("Create Testimonial Error:", err);
    res.status(500).json({ success: false });
  }
};

/*  UPDATE  */
const updateTestimonials = async (req, res) => {
  try {
    const parsed = JSON.parse(req.body.testimonials || "[]");

    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const updatedTestimonials = await Promise.all(
      parsed.map(async (item, index) => {
        let imageUrl = item.image || "";

        const file = req.files?.[`image[${index}]`];

        if (file) {
          if (!allowedFormats.includes(file.mimetype)) {
            throw new Error("Invalid image format");
          }

          const upload = await cloudinary.uploader.upload(
            file.tempFilePath,
            { folder: "brilson/testimonials" }
          );

          imageUrl = upload.secure_url;
        }

      
        if (item._id) {
          return TestimonialsModel.findByIdAndUpdate(
            item._id,
            {
              name: item.name,
              review: item.review,
              rating: item.rating,
              image: imageUrl,
            },
            { new: true }
          );
        }

        return TestimonialsModel.create({
          name: item.name,
          review: item.review,
          rating: item.rating || 5,
          image: imageUrl,
        });
      })
    );

    res.status(200).json({
      success: true,
      testimonials: updatedTestimonials,
    });
  } catch (error) {
    console.error("Update Testimonials Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*  GET  */
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await TestimonialsModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  createTestimonials,
  updateTestimonials,
  getTestimonials,
};
