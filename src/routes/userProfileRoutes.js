const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")
const AuthTokenManager = require("../utils/authTokenManager")
const express = require("express");
const auth = require("../middleware/authMiddleware")
const setLimitter = require("../middleware/rateLimitMiddleware")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validateMiddleware")
const upload = require("../middleware/uploadMiddleware");


const userService = new UserService(userModel)
const tokenService = new TokenService(userTokens)
const authTokenManager = new AuthTokenManager()

const userController = new UserController(userService, tokenService, authTokenManager)

const router = express.Router()

router.route("/")
    .get(auth, setLimitter, userController.userInfo)
    .patch(auth, validation("updateUserValidation"), userController.updateUser)

router.delete("/phoneNumber", auth, setLimitter, validation("deletePhoneNumberValidation"), userController.removePhoneNumber)

router.patch("/changePassword", auth, validation("changePasswordValidation"), userController.changePassword)

router.post("/image", auth, upload.single("avatar"), userController.setImage)

router.route("/image/:fileName")
    .get(auth, setLimitter, userController.getImage)
    .delete(auth, userController.deleteImage)

module.exports = router