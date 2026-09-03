const express = require("express");
const router = express.Router();
const { getCardProfiles, getAllcardsProfile, copyUpdate, getCardProfilesByID, getRecentCards } = require("../controller/GetCardProfile.controller");
const { ActivateCardAPi, EditCardProfile, updateCountryCode, updateWaCountryCode, getMyReferrals, getAllReferralsForAdmin } = require("../controller/ActivateCardAPi.controller");
const bulkCreateCards = require("../controller/AdminBulkCardProfile.controller");
const adminAuth = require("../middleware/authAdminToken");
const claimCardProfile = require("../controller/ClaimcardProfile.controller");
const authUserToken = require("../middleware/authUserToken");
const authAdminToken = require("../middleware/authAdminToken");
const checkCardStatus = require("../controller/checkCardStatus.controller");
const markDownloadedOnCard = require("../controller/MarkDownloadedCard.controller");

// ek user ne jitne card activate kiye hai use nikal rhe hai

const { getLoggedInUserCards, getAllUsersWithTheirCards } = require("../controller/GetSingleUserMultipleCard")


const authUser = require("../middleware/authUserToken");



// admin cretae bulk profile cards
router.post("/cards/bulk", bulkCreateCards);


// POST /api/card/activate
router.post("/card/activate", authUserToken, ActivateCardAPi);

// POST /GET/Referral
router.get("/user/referral", authUserToken, getMyReferrals);

// POST /GET/All/Referral/ For Admin
router.get("/admin/referrals", authAdminToken, getAllReferralsForAdmin);

// GET /api/card/:slug
router.get("/card/:slug", getCardProfiles);
// router.get("/card/:id", getCardProfilesByID);
router.get("/all/cards",authAdminToken, getAllcardsProfile);

router.get("/all/recent",authAdminToken, getRecentCards);
// is api se url copy and update kara rha hu
router.patch("/cards/:id/copy", copyUpdate);


// PUT /api/card/:id/edit
router.put("/card/:id/editCountryCode", authUserToken, updateCountryCode);


// PUT /api/card/:id/edit
router.put("/card/:id/editWaCountryCode", authUserToken, updateWaCountryCode);


// PUT /api/card/:id/edit
router.put("/card/:id/edit", authUserToken, EditCardProfile);


router.get("/claim-card-profile", authUserToken, claimCardProfile);

// check card status
router.get("/check/card/:activationCode", checkCardStatus);


// mark card downloaded or not
router.patch("/cards/:id/downloaded", markDownloadedOnCard);



// ek user jitne card activate kiye hai use nikal rhe hai.
// router.get("/cards/user",authUser, getAllcardsProfile);
router.get("/cards", getAllUsersWithTheirCards);
router.get("/cards/user/:userId", authUser, getAllUsersWithTheirCards);


module.exports = router;