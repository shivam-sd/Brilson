const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    review: {
      type: String,
      trim: true,
      required: [true, "Review is required"],
    },

    rating: {
      type: Number,
      required: true,
      default: 5,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

const TestimonialModel = mongoose.model(
  "Testimonial",
  TestimonialSchema
);

module.exports = TestimonialModel;
