const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/authAdminToken");
const userAuth = require("../middleware/authUserToken");
const bulkCreateParkingTags = require("../controller/ParkingTag/AdminBulkTagCreate.controller");
const {ActivateParkingTagAPi, EditParkingTagProfile} = require("../controller/ParkingTag/ActivateParkingTag.controller");
const checkParkingTagStatus = require("../controller/ParkingTag/CheckParkingTagStatus.controller");
const claimParkingTagProfile = require("../controller/ParkingTag/ClaimParkingTagProfile.controller");
const {getParkingTagProfiles, getAllParkingTagsProfile} = require("../controller/ParkingTag/GetTagProfile.controller");
const markDownloadedOnTag = require("../controller/ParkingTag/MarkDownloadedTag.controller");
const {getAllUsersWithTheirCards} = require("../controller/ParkingTag/GetUserWithTheirParkingTag.controller");


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
router.get("/tag/profile/:slug", getParkingTagProfiles);
 
router.put("/tag/:id/edit", userAuth, EditParkingTagProfile);

// Manage Parking Tag Api For Admin Side

// router.get("/card/:id", getCardProfilesByID);
router.get("/all/tags", getAllParkingTagsProfile);

// mark card downloaded or not
router.patch("/tags/:id/downloaded", markDownloadedOnTag);
router.get("/tags/user/:userId",userAuth, getAllUsersWithTheirCards);



module.exports = router;
