const express = require("express");
const router = express.Router();

const { addService, updateService, getServices, getSingleService, deleteService, getSectionAvailability} = require("../../controller/ProfileController/ProfileServices.controller");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addService);
router.put("/update/:serviceId", updateService);
router.get("/all/get/:activationCode", getServices);
router.get("/get/single/:serviceId", getSingleService);
router.delete("/delete/:serviceId", deleteService);
router.get("/section-availability/:activationCode", getSectionAvailability);


module.exports = router;