const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/authUserToken");
const {bulkCreateGoogleReviews} = require("../controller/GoogleReviews/AdminBulkReviewCardCreate.controller");
const {ActivateGoogleReview} = require("../controller/GoogleReviews/ActivateGoogleReview.controller");
const markDownloadQRGoogleReviews = require("../controller/GoogleReviews/MarkDownloadQRGoogleReview");
const getSingleGoogleReviewProfile = require("../controller/GoogleReviews/GetSimgleGoogleReviewProfile");
const GetAllGoogleReviewProfiles = require("../controller/GoogleReviews/getAllGoogleReviewProfile.controller");
const getAllUsersWithTheirReviews = require("../controller/GoogleReviews/getAllUsersWithTheirReviews");
const { checkGoogleReview } = require("../controller/GoogleReviews/CheckGoogleReviewStatus.controller");


// admin cretae bulk profile cards
router.post("/google-review/card/bulk",  bulkCreateGoogleReviews);

// activate google review api
router.post("/google-review/card/activate", userAuth, ActivateGoogleReview);

// check parking tag status 
router.get("/check/google-reviews/:activationCode", checkGoogleReview);

// google review mark download
router.patch("/google-review/:id/downloaded", markDownloadQRGoogleReviews);

// get single google review
router.get("/google-review/profile/:slug", getSingleGoogleReviewProfile);

// router.get("/card/:id", getCardProfilesByID); 
router.get("/all/google-reviews", GetAllGoogleReviewProfiles);

router.get("/google-reviews/user/:userId", userAuth, getAllUsersWithTheirReviews);

module.exports = router;