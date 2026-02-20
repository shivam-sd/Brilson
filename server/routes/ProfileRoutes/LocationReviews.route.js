const express = require("express");
const router = express.Router();
const {addLocationReviews, updateLocationReviews, getLocationReviews} = require("../../controller/ProfileController/Location&Reviews.controller");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addLocationReviews);
router.put("/update/:locationId", updateLocationReviews);
router.get("/get/:activationCode", getLocationReviews);


module.exports = router;