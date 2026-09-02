const shippingAddressModel = require("../models/ShippingAddress.model");


const ShippingAddress = async (req, res) => {
      try {
        const userId = req.user;

        const {
            fullName,
            phoneNumber,
            email,
            address
        } = req.body;

      
        const existingAddress = await shippingAddressModel.findOne({ userId });

      
        if (existingAddress) {

            existingAddress.fullName = fullName;
            existingAddress.phoneNumber = phoneNumber;
            existingAddress.email = email;
            existingAddress.address = address;

            await existingAddress.save();

            return res.status(200).json({
                success: true,
                message: "Shipping address updated successfully",
                shippingAddress: existingAddress
            });
        }

       
        const shippingAddress = await shippingAddressModel.create({
            userId,
            fullName,
            phoneNumber,
            email,
            address
        });

        return res.status(201).json({
            success: true,
            message: "Shipping address added successfully",
            shippingAddress
        });

    } catch (error) {
        console.error("Shipping Address Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}



const getShippingAddress = async (req, res) => {
    try {
        const userId = req.user;
        const shippingAddress = await shippingAddressModel.findOne({ userId });

        if (!shippingAddress) {
            return res.status(404).json({
                success: false,
                message: "Shipping address not found"
            });
        }

        return res.status(200).json({
            success: true,
            shippingAddress
        });
    } catch (error) {
        console.error("Error fetching shipping address:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    ShippingAddress,
    getShippingAddress 
};