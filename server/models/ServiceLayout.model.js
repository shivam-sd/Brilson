const mongoose = require("mongoose");

const ServiceLayoutSchema = new mongoose.Schema({
    layoutType: {
        type: String,
        enum: ["carousel", "flex"],
        default: "flex"
    },
    activationCode: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


const ServiceLayout = mongoose.model("ServiceLayout", ServiceLayoutSchema);


    module.exports = ServiceLayout;