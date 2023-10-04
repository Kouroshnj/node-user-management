const express = require("express");
const auth = require("../middleware/auth")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validate")
const upload = require("../middleware/upload")

const router = express.Router()

const userController = new UserController()


router.post("/users/signup", validation("userValidation"), userController.signUp)

router.post("/users/login", validation("LoginValidation"), userController.logIn)

router.post("/users/logout", auth, userController.logOut)

router.route("/users/profile")
    .get(auth, userController.userInfo)
    .patch([auth, validation("updateUserValidation")], userController.updateUser)

router.delete("/users/profile/phoneNumber", [auth, validation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/users/profile/changePassword", [auth, validation("changePasswordValidation")], userController.changePassword)

router.route("/users/profile/image")
    .post(auth, upload.single("avatar"), userController.setImage)

router.route("/users/profile/image/:fileName")
    .get(auth, userController.getImage)
    .delete(auth, userController.deleteImage)

module.exports = router