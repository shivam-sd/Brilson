const express = require("express");
const router = express.Router();

const {
  createTransformNetwork,
  updateTransformNetwork,
  getTransformNetwork,
} = require("../../controller/LandingPage/TransformNetwork.controller");


router.post("/transform/create", createTransformNetwork);
router.put("/transform/update", updateTransformNetwork);
router.get("/transform", getTransformNetwork);



module.exports = router;
