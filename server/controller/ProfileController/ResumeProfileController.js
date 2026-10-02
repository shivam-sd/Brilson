const resumeModel = require("../../models/ProfileModel/ProfileResume");
const CardProfile = require("../../models/CardProfile");
const { uploadPdf, deleteFile } = require("../../services/resumeUpload.service");

const addResume = async (req, res) => {
    try {
        const { activationCode } = req.body;
        const userId = req?.user;

        const card = await CardProfile.findOne({ activationCode });

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        const file = req?.files?.resume;

        if (!file) {
            return res.status(400).json({
                message: "Resume file is required",
            });
        }

        const uploadedPdf = await uploadPdf(
            file,
            "brilson/profile-resume"
        );

        try {
            const resume = await resumeModel.create({
                cardId: card._id,
                activationCode,
                owner: userId,
                resume: uploadedPdf._id,
            });

            return res.status(201).json({
                success: true,
                resume,
            });
        } catch (error) {
            await deleteFile(uploadedPdf._id);
            throw error;
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to add resume",
        });
    }
};

const updateResume = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await resumeModel.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                message: "Resume Not Found!",
            });
        }

        const file = req?.files?.resume;

        if (!file) {
            return res.status(400).json({
                message: "Resume file is required",
            });
        }

        const oldFileId = resume.resume;

        const uploadedPdf = await uploadPdf(
            file,
            "brilson/profile-resume"
        );

        resume.resume = uploadedPdf._id;
        resume.name = uploadedPdf.fileName;

        try {
            await resume.save();
        } catch (error) {
            await deleteFile(uploadedPdf._id);
            throw error;
        }

        if (oldFileId) {
            try {
                await deleteFile(oldFileId);
            } catch (deleteError) {
                console.log(
                    "Old resume delete error:",
                    deleteError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to update resume",
        });
    }
};

const getResume = async (req, res) => {
    try {
        const { activationCode } = req.params;

        const resume = await resumeModel
            .findOne({ activationCode })
            .populate({
                path: "resume",
                match: { isDeleted: 0 },
                select: "secureUrl fileName",
            });

        if (!resume) {
            return res.status(404).json({
                message: "Resume Not Found",
            });
        }

        res.status(200).json({
            success: true,
            resume,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message || "Internal Server Error",
        });
    }
};

module.exports = {
    addResume,
    updateResume,
    getResume,
};