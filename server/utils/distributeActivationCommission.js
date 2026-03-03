const UserModel = require("../models/User.model");

const LEVEL_COMMISSIONS = [100, 50, 30, 20, 10, 5, 5];

const distributeActivationCommission = async (activatedUserId) => {
  try {
    let currentUser = await UserModel.findById(activatedUserId);
    let level = 0;

    while (currentUser?.referredBy && level < 7) {

      const upline = await UserModel.findById(currentUser.referredBy);
      if (!upline) break;

      const commission = LEVEL_COMMISSIONS[level];

      upline.rewardBalance += commission;
      await upline.save();

      console.log(`Level ${level + 1} → ${upline.name} earned ₹${commission}`);

      currentUser = upline;
      level++;
    }

  } catch (err) {
    console.error("Activation Commission Error:", err);
  }
};

module.exports = distributeActivationCommission;