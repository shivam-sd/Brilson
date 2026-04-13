const express = require("express");
const router = express.Router();
const ServiceLayoutModel = require("../models/ServiceLayout.model");
const userAuth = require("../middleware/authUserToken");

// Single route for both layouts
router.put("/service-layout", userAuth, async (req, res) => {
    try {
        const userId = req.user;
        const { activationCode, layoutType } = req.body;

        if (!activationCode || !layoutType) {
            return res.status(400).json({ 
                error: "activationCode and layoutType are required" 
            });
        }

        if (!["carousel", "flex"].includes(layoutType)) {
            return res.status(400).json({ 
                error: "layoutType must be 'carousel' or 'flex'" 
            });
        }

        const serviceLayout = await ServiceLayoutModel.findOneAndUpdate(
            { userId, activationCode },
            { layoutType },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Service layout updated successfully",
            serviceLayout
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



// Get current layout preference
router.get("/service-layout", userAuth, async (req, res) => {
    try {
        const userId = req.user;
        const { activationCode } = req.query;

        const layout = await ServiceLayoutModel.findOne({ userId, activationCode });

        if (!layout) {
            return res.json({ layoutType: "flex" });
        }

        res.json(layout);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;