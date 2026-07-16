const InvoiceAddressModel = require("../models/InvoiceAddress.model");


const SaveOrUpdateInvoiceAddress = async (req, res) => {
    try{
        
        const payload = req.body;

        // first check allready exist
        const checkExistingData = await InvoiceAddressModel.findOne();

        let invoiceAddress;

if(checkExistingData){
    invoiceAddress = await InvoiceAddressModel.findByIdAndUpdate(checkExistingData._id, payload, {
        new:true
    });

    return res.status(200).json({message:"Invoice Address Updated!"});
}


// Create

invoiceAddress = await InvoiceAddressModel.create(payload);

return res.status(201).json({message:"Invoice Address Added!"});


    }catch(err){
        res.status(500).json({error:err.message});
    }
}




const FetchInvoiceData = async (req, res) => {
    try{
        const InvoiceAddress = await InvoiceAddressModel.findOne();
        
        if(!InvoiceAddress){
            return res.status(404).json({error:"Invoice Address not found"});
        }
        
        res.status(200).json({message:"Invoice Address Details", InvoiceAddress});

    }catch(err){
        res.status(500).json({error:err.message});
    }
}



module.exports = {
    SaveOrUpdateInvoiceAddress,
    FetchInvoiceData
}