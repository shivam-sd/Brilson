const express = require("express");
const router = express.Router();
const {addResume, updateResume, getResume} = require("../../controller/ProfileController/ResumeProfileController");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addResume);
router.put("/update/:resumeId", updateResume);
router.get("/get/:activationCode", getResume);



module.exports = router;