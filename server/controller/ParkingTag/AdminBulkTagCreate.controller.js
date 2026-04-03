const ParkingTagModel = require(".././../models/AddParkingTag.model");
const generateActivationCode = require("../../utils/generateActivationCode");


const bulkCreateParkingTags = async (req, res) => {
    try{
        const {count} = req.body;

    if(!count || count <= 0){
        return res.status(400).json({error:"Invalid Count"});
    }

    const Tags = [];

    for(let i = 0; i < count; i++){
        const activationCode = generateActivationCode();

        Tags.push({
            activationCode,
            isActivated: false,

             // QR me sirf activationCode
        qrUrl: `${process.env.BASE_URL1}/c/parking-tag/${activationCode}`, 
        // ye yah check karta ki card activate hai ya nhi agar card activate hai to profile per bhejega agar card activate nhi hai to activation page per bhejega..
        
        });
    }


await ParkingTagModel.insertMany(Tags);


    res.status(201).json({
      success: true,
      message: "Parking Tags created successfully",
      total: Tags.length,
      Tags,
    });
    }catch(err){
         console.error("Bulk Create Error:", err);
    res.status(500).json({ error: "Bulk create failed" });
    }
}


module.exports = bulkCreateParkingTags;