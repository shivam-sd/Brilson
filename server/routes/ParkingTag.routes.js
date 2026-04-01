const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/authAdminToken");
const userAuth = require("../middleware/authUserToken");
const bulkCreateParkingTags = require("../controller/ParkingTag/AdminBulkTagCreate.controller");
const {ActivateParkingTagAPi} = require("../controller/ParkingTag/ActivateParkingTag.controller");
const checkParkingTagStatus = require("../controller/ParkingTag/CheckParkingTagStatus.controller");
const claimParkingTagProfile = require("../controller/ParkingTag/ClaimParkingTagProfile.controller");
const {getParkingTagProfiles, getAllParkingTagsProfile} = require("../controller/ParkingTag/GetTagProfile.controller");



// admin cretae bulk profile cards
router.post("/tags/bulk",  bulkCreateParkingTags);

// activate parking tag api
router.post("/tags/activate", userAuth, ActivateParkingTagAPi);


// check parking tag status
router.get("/check/tag/:activationCode", checkParkingTagStatus);

// claim parking tag profile
router.get("/claim-tag-profile", userAuth, claimParkingTagProfile);


// GET /api/card/:slug
router.get("/tag/:slug", getParkingTagProfiles);
// router.get("/card/:id", getCardProfilesByID);
router.get("/all/tags", getAllParkingTagsProfile);



module.exports = router;
