const ProfileService = require("../../models/ProfileModel/ProfileServices.Model");
const CardProfile = require("../../models/CardProfile");


const addService = async (req, res) => {
  try {
    const userId = req.user;
    const {
      activationCode,
      title,
      description,
      features,
      price,
    } = req.body;

    // Find card
    const card = await CardProfile.findOne({ activationCode });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const service = await ProfileService.create({
      cardId: card._id,
      owner: userId,
      activationCode,
      title,
      description,
      features: features || [],
      price,
    });

    res.status(201).json({
      success: true,
      data: service,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
   
    const service = await ProfileService.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }


    const {
      title,
      description,
      features,
      price
    } = req.body;


    if (title) service.title = title;
    if (description) service.description = description;
    if (features) service.features = features;
    if (price) service.price = price;

    await service.save();

    res.json({
      success: true,
      message: "Service updated",
      data: service,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getServices = async (req, res) => {
  try {
    const { activationCode } = req.params;

    const services = await ProfileService
      .find({ activationCode })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getSingleService = async (req, res) => {
    try{
        const { serviceId } = req.params;

        const service = await ProfileService.findById(serviceId);

        if(!service){
            return res.status(404).json({message: "Service not found"});
        }

        res.json({
            success: true,
            data: service,
        })

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}



const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await ProfileService.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      message: "Service deleted",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addService,
  updateService,
  getServices,
  getSingleService,
  deleteService,
};