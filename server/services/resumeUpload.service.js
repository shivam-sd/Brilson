const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const Image = require("../models/Image.model");

const MAX_PDF_SIZE = 10 * 1024 * 1024;
const ALLOWED_PDF_MIME_TYPES = ["application/pdf"];

const createError = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

const validatePdfFile = (file) => {
    if (!file) {
        throw createError("PDF file is required");
    }

    if (!ALLOWED_PDF_MIME_TYPES.includes(file.mimetype)) {
        throw createError("Only PDF files are allowed");
    }

    if (!file.size || file.size <= 0) {
        throw createError("PDF file is empty");
    }

    if (file.size > MAX_PDF_SIZE) {
        throw createError("PDF size must be less than 10MB");
    }
};

const uploadPdfToCloudinary = (file, folder) =>
    new Promise((resolve, reject) => {
        if (!file.tempFilePath) {
            return reject(
                createError("Temporary PDF file path is required")
            );
        }

        cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder,
                public_id: crypto.randomUUID(),
                resource_type: "raw",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );
    });

const uploadPdf = async (file, folder) => {
    validatePdfFile(file);

    if (!folder) {
        throw createError("PDF folder is required");
    }

    const result = await uploadPdfToCloudinary(file, folder);

    try {
        const pdf = await Image.create({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            fileName: file.name || file.originalname,
            folder,
            format: result.format || "pdf",
            resourceType: "raw",
            bytes: result.bytes,
            width: result.width || 1,
            height: result.height || 1,
        });

        return pdf;
    } catch (error) {
        try {
            await cloudinary.uploader.destroy(result.public_id, {
                resource_type: "raw",
            });
        } catch (cleanupError) {
            console.error(
                `Orphan PDF on Cloudinary: ${result.public_id}`,
                cleanupError
            );
        }

        throw error;
    }
};

const deleteFile = async (fileId) => {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw createError("Invalid file ID");
    }

    const file = await Image.findOne({
        _id: fileId,
        isDeleted: 0,
    });

    if (!file) {
        throw createError("File not found", 404);
    }

    let cloudinaryDeleted = false;

    try {
        const result = await cloudinary.uploader.destroy(
            file.publicId,
            {
                resource_type: file.resourceType,
            }
        );

        cloudinaryDeleted =
            result.result === "ok" ||
            result.result === "not found";
    } catch (error) {
        console.error(
            `Cloudinary file delete failed: ${file.publicId}`,
            error
        );
    }

    file.isDeleted = 1;
    file.deletedAt = new Date();
    file.cloudinaryDeleted = cloudinaryDeleted;

    await file.save();

    return {
        success: true,
        fileId: file._id,
        cloudinaryDeleted,
    };
};

module.exports = {
    uploadPdf,
    deleteFile,
};