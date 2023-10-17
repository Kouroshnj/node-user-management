const express = require("express");
const auth = require("../middleware/auth")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validate")

const router = express.Router()

const userController = new UserController()


router.post("/signup", validation("userValidation"), userController.signUp)

router.post("/login", validation("LoginValidation"), userController.logIn)

router.post("/logout", auth, userController.logOut)


module.exports = router