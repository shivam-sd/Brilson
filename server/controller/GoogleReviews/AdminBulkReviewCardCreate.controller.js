const GoogleReviewModel = require(".././../models/AddGoogleReviews.model");
const generateActivationCode = require("../../utils/generateActivationCode");


const bulkCreateGoogleReviews = async (req, res) => {
    try{
        const {count} = req.body;

    if(!count || count <= 0){
        return res.status(400).json({error:"Invalid Count"});
    }

    const GoogleReviews = [];

    for(let i = 0; i < count; i++){
        const activationCode = generateActivationCode();

        GoogleReviews.push({
            activationCode,
            isActivated: false,

             // QR me sirf activationCode
        qrUrl: `${process.env.BASE_URL1}/c/google-review/${activationCode}`, 
        // ye yah check karta ki card activate hai ya nhi agar card activate hai to profile per bhejega agar card activate nhi hai to activation page per bhejega..
        
        });
    }


await GoogleReviewModel.insertMany(GoogleReviews);


    res.status(201).json({
      success: true,
      message: "Google Reviews created successfully",
      total: GoogleReviews.length,
      GoogleReviews,
    });
    }catch(err){
         console.error("Bulk Create Error:", err);
    res.status(500).json({ error: "Bulk create failed" });
    }
}


module.exports = bulkCreateGoogleReviews;


module.exports = {
    bulkCreateGoogleReviews,
}