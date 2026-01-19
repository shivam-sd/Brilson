const mongoose = require("mongoose");

const HomepageContentSchema = new mongoose.Schema({
  heroSection: {
    badgeText: String,                         //"FUTURE OF NETWORKING",
    headingPrimary: String,                    //"YOUR IDENTITY",
    headingAccent: String,                     //"DIGITALLY ELEVATED",
    subHeading: String,                                 //"Smart NFC & QR cards for modern professionals. Tap once. Connect forever.",
      Highlight: String,                        //"Tap once. Connect forever."
  },

features: {
    items: [
      {
        title: String,                          //"Secure",
        description: String,                   // "Encrypted data",
        image: String                         //"shield"
      },
    ]
  },

});



const HomepageContentModel = new mongoose.model("HomepageContent",  HomepageContentSchema);


module.exports = HomepageContentModel;