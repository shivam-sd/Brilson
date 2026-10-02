const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },

        secureUrl: {
            type: String,
            required: true,
            trim: true,
        },

        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        folder: {
            type: String,
            required: true,
            trim: true,
        },

        format: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        resourceType: {
            type: String,
            enum: ["image", "raw"],
            default: "image",
        },

        bytes: {
            type: Number,
            required: true,
            min: 0,
        },

        width: {
            type: Number,
            required: true,
            min: 1,
        },

        height: {
            type: Number,
            required: true,
            min: 1,
        },

        isDeleted: {
            type: Number,
            default: 0,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
        },

        cloudinaryDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;