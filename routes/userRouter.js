const express = require("express");
const auth = require("../middleware/auth")
const UserController = require("../controllers/userController")
const userValidation = require("../middleware/validate")
const upload = require("../middleware/upload")

const router = express.Router()

const userController = new UserController()


router.post("/users/signup", userValidation("userValidation"), userController.signUp)

router.post("/users/login", userValidation("LoginValidation"), userController.logIn)

router.post("/users/logout", auth, userController.logOut)

router.route("/users/profile")
    .get(auth, userController.userInfo)
    .patch([auth, userValidation("updateUserValidation")], userController.updateUser)

router.delete("/users/profile/phoneNumber", [auth, userValidation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/users/profile/changePassword", [auth, userValidation("changePasswordValidation")], userController.changePassword)

router.route("/users/profile/image")
    .post(auth, upload.single("avatar"), userController.setImage)
    .delete(auth, userController.deleteImage)
    .get(auth, userController.getImage)



module.exports = router