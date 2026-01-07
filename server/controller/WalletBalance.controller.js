const UserModel = require("../models/User.model");


const getWalletBalance = async (req, res) => {
    try{
        const userId = req.user;

        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            Balance: user.rewardBalance || 0, name:user.name
        });

    }catch(err){
        console.log("Get Wallet Balance Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



module.exports = {
    getWalletBalance
}