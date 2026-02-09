const express = require("express");
const router = express.Router();

const { addProfileGallery, updateGallery, getGallery, getSingleGallery, deleteGallery, } = require("../../controller/ProfileController/ProfileGallery.controller");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addProfileGallery);
router.put("/update/:galleryId", updateGallery);
router.get("/all/get/:activationCode", getGallery);
router.get("/get/single/:galleryId", getSingleGallery);
router.delete("/delete/:galleryId", deleteGallery);


module.exports = router;