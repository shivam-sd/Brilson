const express = require("express");
const router = express.Router();
const {getCardProfiles, getAllcardsProfile, getCardProfilesByID} = require("../controller/GetCardProfile.controller");
const {ActivateCardAPi, EditCardProfile} = require("../controller/ActivateCardAPi.controller");
const bulkCreateCards = require("../controller/AdminBulkCardProfile.controller");
const adminAuth = require("../middleware/authAdminToken");
const claimCardProfile = require("../controller/ClaimcardProfile.controller");
const authUserToken = require("../middleware/authUserToken");
const checkCardStatus = require("../controller/checkCardStatus.controller");
const markDownloadedOnCard = require("../controller/MarkDownloadedCard.controller");



// admin cretae bulk profile cards
router.post("/cards/bulk",  bulkCreateCards);


// POST /api/card/activate
router.post("/card/activate", authUserToken, ActivateCardAPi);

// GET /api/card/:slug
router.get("/card/:slug", getCardProfiles);
// router.get("/card/:id", getCardProfilesByID);
router.get("/all/cards", getAllcardsProfile);

// PUT /api/card/:id/edit
router.put("/card/:id/edit",authUserToken, EditCardProfile);


router.get("/claim-card-profile", authUserToken, claimCardProfile);

// check card status
router.get("/check/card/:cardId", checkCardStatus);


// mark card downloaded or not
router.patch("/cards/:id/downloaded", markDownloadedOnCard);


module.exports = router;