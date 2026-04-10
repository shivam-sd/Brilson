const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/authUserToken");
const {bulkCreateGoogleReviews} = require("../controller/GoogleReviews/AdminBulkReviewCardCreate.controller");
const {ActivateGoogleReview} = require("../controller/GoogleReviews/ActivateGoogleReview.controller")


// admin cretae bulk profile cards
router.post("/google-review/card/bulk",  bulkCreateGoogleReviews);

// activate google review api
router.post("/google-review/card/activate", userAuth, ActivateGoogleReview);




module.exports = router;