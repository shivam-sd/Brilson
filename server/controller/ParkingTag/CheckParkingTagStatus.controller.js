const parkingTagModel = require("../../models/AddParkingTag.model");


const checkParkingTagStatus = async(req,res) => {
    try{
        const {activationCode} = req.params;
        console.log("activation code" , activationCode);

        const tag = await parkingTagModel.findOne({activationCode});

        if(!tag){
            return res.status(404).json({error:"Invalid Parking Tag"});
        }

        if(!tag.isActivated){
            return res.json({isActivated:tag.isActivated});
        }

       return res.status(200).json({
            isActivated:tag.isActivated,
            slug:tag.slug
        });

    }catch(err){
        res.status(500).json({error:"Server Error"});
    }
}



module.exports = checkParkingTagStatus;