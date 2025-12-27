const express = require("express");
const { UserRegister, UserLogin, findLoggedInUser, getMyActiveCard } = require("../controller/User.Controller");
const authUser = require("../middleware/authUserToken");
const router = express.Router();



router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/loggedIn/user", authUser, findLoggedInUser);
router.get("/my-active-card", authUser, getMyActiveCard);



module.exports = router;