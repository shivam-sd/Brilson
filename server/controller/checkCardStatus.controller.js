const cardProfileModel = require("../models/CardProfile");


const checkCardStatus = async(req,res) => {
    try{
        const {activationCode} = req.params;
        console.log("activation code" , activationCode)

        const card = await cardProfileModel.findOne({activationCode});

        if(!card){
            return res.status(404).json({error:"Invalid Card"});
        }

        if(!card.isActivated){
            return res.json({isActivated:card.isActivated});
        }

       return res.status(200).json({
            isActivated:card.isActivated,
            slug:card.slug
        });

    }catch(err){
        res.status(500).json({error:"Server Error"});
    }
}



module.exports = checkCardStatus;