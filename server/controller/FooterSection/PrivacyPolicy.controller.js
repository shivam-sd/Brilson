const PrivacyPolicyModel = require("../../models/FooterSection.jsx/PrivacyPolicy.model");


// CREATE OR UPDATE PRIVACY POLICY

const createOrUpdatePrivacyPolicy = async (req, res) => {

  try {

    const payload = req.body;

    // check existing data
    let existingPolicy =
      await PrivacyPolicyModel.findOne();

    let privacyPolicy;

    // UPDATE
    if (existingPolicy) {

      privacyPolicy =
        await PrivacyPolicyModel.findByIdAndUpdate(
          existingPolicy._id,
          payload,
          {
            new: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Privacy Policy updated successfully",
        data: privacyPolicy,
      });
    }

    // CREATE
    privacyPolicy =
      await PrivacyPolicyModel.create(payload);

    return res.status(201).json({
      success: true,
      message:
        "Privacy Policy created successfully",
      data: privacyPolicy,
    });

  } catch (error) {

    console.log(
      "Privacy Policy Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save privacy policy",
    });
  }
};




// GET PRIVACY POLICY

const getPrivacyPolicy = async (req, res) => {

  try {

    const privacyPolicy =
      await PrivacyPolicyModel.findOne();

    if (!privacyPolicy) {

      return res.status(404).json({
        success: false,
        message:
          "Privacy Policy not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: privacyPolicy,
    });

  } catch (error) {

    console.log(
      "Get Privacy Policy Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch privacy policy",
    });
  }
};

module.exports = {
  createOrUpdatePrivacyPolicy,
  getPrivacyPolicy,
};