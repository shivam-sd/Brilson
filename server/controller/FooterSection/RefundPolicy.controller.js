const RefundPolicyModel = require("../../models/FooterSection.jsx/RefundPolicy.Model");

// CREATE OR UPDATE
const createOrUpdateRefundPolicy = async (req, res) => {
  try {
    const payload = req.body;

    let existingData =
      await RefundPolicyModel.findOne();

    let refundPolicy;

    if (existingData) {
      refundPolicy =
        await RefundPolicyModel.findByIdAndUpdate(
          existingData._id,
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Refund Policy updated successfully",
        data: refundPolicy,
      });
    }

    refundPolicy =
      await RefundPolicyModel.create(payload);

    return res.status(201).json({
      success: true,
      message:
        "Refund Policy created successfully",
      data: refundPolicy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save refund policy",
    });
  }
};

// GET
const getRefundPolicy = async (
  req,
  res
) => {
  try {
    const refundPolicy =
      await RefundPolicyModel.findOne();

    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message:
          "Refund Policy not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: refundPolicy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch refund policy",
    });
  }
};

module.exports = {
  createOrUpdateRefundPolicy,
  getRefundPolicy,
};