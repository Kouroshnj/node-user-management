const express = require("express");
const auth = require("../middleware/auth")
const UserController = require("../controllers/userController")
const userValidation = require("../middleware/validate")
const upload = require("../middleware/upload")

const router = express.Router()

const userController = new UserController()


router.post("/users/Signup", userValidation("userValidation"), userController.signUp)

router.post("/users/Login", userValidation("LoginValidation"), userController.logIn)

router.post("/users/Logout", auth, userController.logOut)

router.route("/users/me")
    .get(auth, userController.userInfo)
    .patch([auth, userValidation("updateUserValidation")], userController.updateUser)

router.delete("/users/me/delete_phoneNumber", [auth, userValidation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/users/me/changePassword", [auth, userValidation("changePasswordValidation")], userController.changePassword)

router.route("/users/me/image")
    .post(auth, upload.single("avatar"), userController.setImage)
    .delete(auth, userController.deleteImage)
    .get(auth, userController.getImage)



module.exports = router