const UserModel = require("../models/User.model");
const ReferralCommissionModel = require("../models/ReferralCommission.model");

const distributeActivationCommission = async (activatedUserId) => {
  try {
    
    let currentUser = await UserModel.findById(activatedUserId);

    if (!currentUser) {
      console.log("Activated user not found:", activatedUserId);
      return;
    }

  
    const commissionConfigs = await ReferralCommissionModel.find()
      .sort({ level: 1 })
      .lean();

    if (!commissionConfigs.length) {
      console.log("No referral commission configuration found");
      return;
    }

    let level = 0;


    while (
      currentUser?.referredBy &&
      level < commissionConfigs.length
    ) {
      
      const upline = await UserModel.findById(
        currentUser.referredBy
      );

      if (!upline) {
        console.log(
          `Upline not found for level ${level + 1}`
        );
        break;
      }

    
      const commissionConfig = commissionConfigs[level];

      
      const commission = Number(commissionConfig.amount) || 0;

    
      upline.rewardBalance =
        (Number(upline.rewardBalance) || 0) + commission;

      await upline.save();

      console.log(
        `Level ${commissionConfig.level} → ${upline.name} earned ₹${commission}`
      );


      currentUser = upline;
      level++;
    }

    console.log(
      `Activation commission distribution completed for user ${activatedUserId}`
    );
  } catch (err) {
    console.error(
      "Activation Commission Error:",
      err
    );
  }
};

module.exports = distributeActivationCommission;