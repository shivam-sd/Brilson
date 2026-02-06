const express = require("express");
const router = express.Router();

const { addPortfolio, updatePortfolio, getPortfolio, getSinglePortfolio, deletePortfolio} = require("../../controller/ProfileController/ProfilePortfolio.controller");
const authUser = require("../../middleware/authUserToken");



router.post("/add", authUser, addPortfolio);
router.put("/update/:portfolioId", updatePortfolio);
router.get("/all/get/:activationCode", getPortfolio);
router.get("/get/single/:portfolioId", getSinglePortfolio);
router.delete("/delete/:portfolioId", deletePortfolio);


module.exports = router;