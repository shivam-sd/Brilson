const express = require("express");
const router = express();
const {updateProfileLogo, getProfileLogo} = require("../../controller/ProfileController/ProfileLogo.controller");


router.put("/update", updateProfileLogo);
router.get("/get/:activationCode", getProfileLogo);



module.exports = router;