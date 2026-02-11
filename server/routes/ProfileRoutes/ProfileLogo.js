const express = require("express");
const router = express();
const {updateProfileLogo, getProfileLogo, addProfileLogo} = require("../../controller/ProfileController/ProfileLogo.controller");


router.post("/add", addProfileLogo);
router.put("/update", updateProfileLogo);
router.get("/get/:activationCode", getProfileLogo);



module.exports = router;