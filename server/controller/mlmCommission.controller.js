const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");


const distributeMLMCommission = async ({ order, buyerId, referralCode }) => {
  try {
    if (!referralCode) return;

    const currentUser = await UserModel.findOne({ referralCode });
    if (!currentUser) return;

    let level = 1;
    const MAX_LEVEL = 7;

    for (let item of order.items) {
      const product = await ProductModel.findById(item.productId);
      console.log("Product ", product)

      if (!product?.isMLMProduct || !product.mlmConfig?.enabled) continue;

      const commissionConfig = product.mlmConfig.commission;
      console.log("Commision config", commissionConfig)

      let uplineUser = currentUser;

      while (uplineUser && level <= MAX_LEVEL) {
        const levelCommission = commissionConfig.find(
          (c) => c.level === level
        );

        if (!levelCommission) break;

        const commissionAmount =
          (item.price * item.quantity * levelCommission.percentage) / 100;

        uplineUser.walletBalance += commissionAmount;
        await uplineUser.save();

        console.log(
          `MLM → Level ${level} → ${uplineUser.name} earned ₹${commissionAmount}`
        );

        uplineUser = await UserModel.findById({_id:uplineUser.referredBy});
        level++;
      }
    }
  } catch (err) {
    console.error("MLM Commission Error:", err);
  }
};



module.exports = distributeMLMCommission;