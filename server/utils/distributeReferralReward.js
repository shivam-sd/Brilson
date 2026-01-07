const User = require("../models/User.model");
const rewards = [10, 7, 5, 3, 2, 2, 1]; 


const distributeReferralReward = async (buyerId) => {
    try{
        let currentUser = await User.findById(buyerId);
        let orderindex = 0;

        orderindex = currentUser.totalOrders - 1;
        const rewardAmount = rewards[orderindex];

        while(currentUser.referredBy && orderindex < rewards.length){
            const referrer = await User.findById(currentUser.referredBy);

            if(!referrer){
                break;
            }

            referrer.rewardBalance += rewardAmount;
            await referrer.save();

            currentUser = referrer;
        }
    }catch(err){
        console.error("Error in distributeReferralReward:", err);
    }
}



module.exports = distributeReferralReward;