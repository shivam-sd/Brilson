const express = require("express");
const router = express.Router();

const {
  createTransformNetwork,
  updateTransformNetwork,
  getTransformNetwork,
} = require("../../controller/LandingPage/TransformNetwork.controller");
const authAdminToken = require("../../middleware/authAdminToken");


router.post("/transform/create",authAdminToken, createTransformNetwork);
router.put("/transform/update", authAdminToken, updateTransformNetwork);
router.get("/transform", getTransformNetwork);



module.exports = router;
