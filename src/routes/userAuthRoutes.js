const express = require("express");
const auth = require("../middleware/auth")
const validation = require("../middleware/validate")
const userController = require("../controllers/userController")



const router = express.Router()

router.post("/signup", validation("userValidation"), userController.signUp)

router.post("/login", validation("LoginValidation"), userController.logIn)

router.post("/logout", auth, userController.logOut)


module.exports = router