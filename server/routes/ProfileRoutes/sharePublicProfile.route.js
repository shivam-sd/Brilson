const express = require("express");
const { sharePublicProfile } = require("../../controller/ProfileController/SharePublicProfile.controller");
const router = express.Router();


router.get("/profile/:slug", sharePublicProfile);


module.exports = router;