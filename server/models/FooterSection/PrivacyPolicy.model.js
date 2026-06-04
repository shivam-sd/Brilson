const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
  {
    // HERO SECTION
    hero: {
      title: {
        type: String,
        default: "Privacy Policy",
      },

      description: {
        type: String,
      },
    },

    // OVERVIEW
    overview: {
      title: String,

      descriptionOne: String,

      descriptionTwo: String,

      highlightText: String,
    },

    // DATA COLLECTION
    dataCollection: {
      title: String,

      personalInformation: {
        title: String,

        items: [String],
      },

      usageData: {
        title: String,

        items: [String],
      },
    },

    // HOW WE USE DATA
    howWeUseData: {
      title: String,

      description: String,

      items: [
        {
          number: String,
          text: String,
        },
      ],
    },

    // DATA SHARING
    dataSharing: {
      title: String,

      description: String,

      neverShare: {
        title: String,

        items: [String],
      },

      mayShare: {
        title: String,

        items: [String],
      },
    },

    // SECURITY MEASURES
    securityMeasures: {
      title: String,

      cards: [
        {
          title: String,

          subtitle: String,
        },
      ],
    },

    // USER RIGHTS
    userRights: {
      title: String,

      accessControl: {
        title: String,

        items: [String],
      },

      additionalRights: {
        title: String,

        items: [String],
      },
    },

    // POLICY CHANGES
    policyChanges: {
      title: String,

      description: String,

      highlightText: String,
    },

    // CONTACT
    contact: {
      title: String,

      description: String,

      email: String,

      responseTime: String,
    },
  },

  {
    timestamps: true,
  }
);

const PrivacyPolicyModel = mongoose.model(
  "PrivacyPolicy",
  privacyPolicySchema
);

module.exports = PrivacyPolicyModel;