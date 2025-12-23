const express = require("express");
const { UserRegister, UserLogin, findLoggedInUser } = require("../controller/User.Controller");
const authUser = require("../middleware/authUserToken");
const router = express.Router();



router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/loggedIn/user", authUser, findLoggedInUser);



module.exports = router;