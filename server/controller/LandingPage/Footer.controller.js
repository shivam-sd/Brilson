const FooterModel = require("../../models/LandingPage/Footer.model");




const addFooter = async (req, res) => {
  try {

    const footer = new FooterModel(req.body);
    await footer.save();

    res.status(201).json({
      success: true,
      message: "Footer added successfully",
      data: footer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};






const updateFooter = async (req, res) => {
  try {
    const updated = await FooterModel.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




const getFooter = async (req, res) => {
  try {
    const footer = await FooterModel.findOne();
    res.status(200).json({ success: true, data: footer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




module.exports = {addFooter, getFooter, updateFooter };
