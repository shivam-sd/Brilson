const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const Image = require("../models/Image.model");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const createError = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

const validateFile = (file) => {
    if (!file) {
        throw createError("Image file is required");
    }
    if (!file.buffer && !file.tempFilePath) {
        throw createError("Image file data is missing");
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw createError("Only JPEG, JPG, PNG and WebP images are allowed");
    }
    if (file.size > MAX_FILE_SIZE) {
        throw createError("Image size must be less than 5MB");
    }
};

const uploadToCloudinary = (file, folder) =>
    new Promise((resolve, reject) => {
        if (file?.buffer) {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: crypto.randomUUID(),
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(file.buffer);
            return;
        }

        if (file?.tempFilePath) {
            cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder,
                    public_id: crypto.randomUUID(),
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            return;
        }

        reject(createError("Image file data is missing"));
    });

const uploadImage = async (file, folder) => {
    validateFile(file);
    if (!folder) throw createError("Image folder is required");

    const result = await uploadToCloudinary(file, folder);

    try {
        return await Image.create({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            folder,
            fileName: file.originalname || file.name,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        try {
            await cloudinary.uploader.destroy(result.public_id, {
                resource_type: "image",
            });
        } catch (cleanupError) {
            console.log(
                `Orphan image on Cloudinary: ${result.public_id}`,
                cleanupError
            );
        }
        throw error;
    }
};

const deleteImage = async (imageId) => {
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
        throw createError("Invalid image ID");
    }

    const image = await Image.findOne({ _id: imageId, isDeleted: 0 });
    if (!image) throw createError("Image not found", 404);

    let cloudinaryDeleted = false;
    try {
        const result = await cloudinary.uploader.destroy(image.publicId, {
            resource_type: image.resourceType,
        });
        cloudinaryDeleted =
            result.result === "ok" || result.result === "not found";
    } catch (error) {
        console.error(`Cloudinary delete failed: ${image.publicId}`, error);
    }

    image.isDeleted = 1;
    image.deletedAt = new Date();
    image.cloudinaryDeleted = cloudinaryDeleted;
    await image.save();

    return { success: true, imageId: image._id, cloudinaryDeleted };
};

const uploadImages = async (files, folder) => {
    if (!Array.isArray(files) || files.length === 0) {
        throw createError("Image files are required");
    }
    if (!folder) throw createError("Image folder is required");

    files.forEach(validateFile);

    const results = await Promise.allSettled(
        files.map((file) => uploadImage(file, folder))
    );

    const uploaded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    const failed = results.find((r) => r.status === "rejected");

    if (failed) {
        const rollbackResults = await Promise.allSettled(
            uploaded.map((img) => deleteImage(img._id))
        );

        rollbackResults.forEach((r, i) => {
            if (r.status === "rejected") {
                console.error(`Rollback failed for image ${uploaded[i]._id}`, r.reason);
            }
        });

        throw failed.reason;
    }

    return uploaded;
};

const deleteImages = async (imageIds) => {
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
        throw createError("Image IDs are required");
    }

    const uniqueIds = [...new Set(imageIds.map(String))];

    const invalidIds = uniqueIds.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
        throw createError(`Invalid image IDs: ${invalidIds.join(", ")}`);
    }

    const results = await Promise.allSettled(
        uniqueIds.map((id) => deleteImage(id))
    );

    const deleted = [];
    const failed = [];

    results.forEach((r, index) => {
        if (r.status === "fulfilled") {
            deleted.push(r.value);
        } else {
            failed.push({
                imageId: uniqueIds[index],
                message: r.reason.message,
                statusCode: r.reason.statusCode || 500,
            });
        }
    });

    return {
        success: failed.length === 0,
        deletedCount: deleted.length,
        failedCount: failed.length,
        deleted,
        failed,
    };
};

module.exports = { uploadImage, uploadImages, deleteImage, deleteImages };
