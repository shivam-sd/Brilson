const express = require("express");
const router = express();
const {addProfileCoverPhoto, updateProfileCover, getProfileCover} = require("../../controller/ProfileController/ProfileCoverPhoto.controller");


router.post("/add", addProfileCoverPhoto);
router.put("/update", updateProfileCover);
router.get("/get/:activationCode", getProfileCover);



module.exports = router;