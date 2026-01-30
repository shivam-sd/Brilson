const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  label: String,
  link: String,
});

const footerSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
    },

    socialLinks: {
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
    },
    
    products: [LinkSchema],
    company: [LinkSchema],
    // support: [LinkSchema],
    bottomLinks: [LinkSchema],
    
    
    contact: {
      email: String,
      phone: String,
      address: String, 
      Link:String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Footer", footerSchema);
