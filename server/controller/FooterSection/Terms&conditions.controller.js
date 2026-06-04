const TermsConditionsModel = require("../../models/FooterSection.jsx/Terms&Conditions.model");



// CREATE OR UPDATE TERMS & CONDITIONS
const createOrUpdateTermsConditions = async (req, res) => {
  try {
    const payload = req.body;

    // Check existing data
    let existingTerms = await TermsConditionsModel.findOne();

    let termsConditions;

    // UPDATE
    if (existingTerms) {
      termsConditions = await TermsConditionsModel.findByIdAndUpdate(
        existingTerms._id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Terms & Conditions updated successfully",
        data: termsConditions,
      });
    }

    // CREATE
    termsConditions = await TermsConditionsModel.create(payload);

    return res.status(201).json({
      success: true,
      message: "Terms & Conditions created successfully",
      data: termsConditions,
    });

  } catch (error) {
    console.log("Terms & Conditions Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save terms & conditions",
    });
  }
};

// GET TERMS & CONDITIONS
const getTermsConditions = async (req, res) => {
  try {
    const termsConditions = await TermsConditionsModel.findOne();

    if (!termsConditions) {
      return res.status(404).json({
        success: false,
        message: "Terms & Conditions not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: termsConditions,
    });

  } catch (error) {
    console.log("Get Terms & Conditions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch terms & conditions",
    });
  }
};

module.exports = {
  createOrUpdateTermsConditions,
  getTermsConditions,
};