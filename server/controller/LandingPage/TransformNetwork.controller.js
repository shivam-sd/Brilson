const TransformNetworkModel = require("../../models/LandingPage/TransformNetwork.model");




const createTransformNetwork = async (req, res) => {
  try {
    const { badgeText, heading, subHeading, features } = req.body;

    
    const alreadyExists = await TransformNetworkModel.findOne();
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "CTA section already exists. Please update it instead.",
      });
    }

    const data = await TransformNetworkModel.create({
      badgeText,
      heading,
      subHeading,
      features,
    });

    res.status(201).json({
      success: true,
      message: "Transform Network section created successfully",
      data,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const updateTransformNetwork = async (req, res) => {
  try {
    const { badgeText, heading, subHeading, features } = req.body;

    const updatedData = await TransformNetworkModel.findOneAndUpdate(
      {},
      {
        badgeText,
        heading,
        subHeading,
        features,
      },
      { new: true, upsert: true } 
    );

    res.status(200).json({
      success: true,
      message: "Transform Network section updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const getTransformNetwork = async (req, res) => {
  try {
    const data = await TransformNetworkModel.findOne();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createTransformNetwork,
  updateTransformNetwork,
  getTransformNetwork,
};
