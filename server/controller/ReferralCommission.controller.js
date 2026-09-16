const ReferralCommissionModel = require("../models/ReferralCommission.model");


const updateReferralCommission = async (req, res) => {
  try {
    const { level } = req.params;
    const { amount } = req.body;

    if (!amount && amount !== 0) {
      return res.status(400).json({
          success: false,
        message: "Amount is required",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    const commission = await ReferralCommissionModel.findOneAndUpdate(
      { level: Number(level) },
      {
        amount: Number(amount),
      },
      {
          new: true,
        runValidators: true,
      }
    );

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "Referral commission level not found",
      });
    }

    return res.status(200).json({
        success: true,
        message: `Level ${level} commission updated successfully`,
        data: commission,
    });
  } catch (error) {
    console.error("Update Referral Commission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update referral commission",
      error: error.message,
    });
  }
};



const getReferralCommissions = async (req, res) => {
    try {
    const commissions = await ReferralCommissionModel.find()
    .sort({ level: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Referral commissions fetched successfully",
      data: commissions,
    });
  } catch (error) {
      console.error("Get Referral Commissions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral commissions",
      error: error.message,
    });
  }
};



// const initializeReferralCommissions = async () => {
//   const defaultCommissions = [
//     { level: 1, amount: 100 },
//     { level: 2, amount: 50 },
//     { level: 3, amount: 30 },
//     { level: 4, amount: 20 },
//     { level: 5, amount: 10 },
//     { level: 6, amount: 5 },
//     { level: 7, amount: 5 },
//   ];

//   for (const commission of defaultCommissions) {
//     await ReferralCommissionModel.updateOne(
//       { level: commission.level },
//       {
//         $setOnInsert: commission,
//       },
//       {
//         upsert: true,
//       }
//     );
//   }
// };

// initializeReferralCommissions();



module.exports = {
    getReferralCommissions,
  updateReferralCommission
};