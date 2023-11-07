const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")
const AuthTokenManager = require("../utils/authTokenManager")

const express = require("express");
const auth = require("../middleware/authMiddleware")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validateMiddleware")

const userService = new UserService(userModel)
const tokenService = new TokenService(userTokens)
const authTokenManager = new AuthTokenManager()

const userController = new UserController(userService, tokenService, authTokenManager)


const router = express.Router()

router.post("/signup", validation("userValidation"), userController.signUp)

router.post("/login", validation("LoginValidation"), userController.logIn)

router.post("/logout", auth, userController.logOut)


module.exports = router