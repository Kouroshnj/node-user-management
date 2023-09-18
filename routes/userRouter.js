const express = require("express");
const auth = require("../middleware/auth")
const updateValidation = require("../middleware/updateValidation")
const userController = require("../controllers/userController")
const userValidation = require("../middleware/validate")
const upload = require("../middleware/upload")

const router = express.Router()


router.post("/users/Signup", userValidation("userValidation"), userController.signUp)

router.post("/users/Login", userValidation("LoginValidation"), userController.logIn)

router.post("/users/Logout", auth, userController.logOut)

router.route("/users/me").get(auth, userController.userInfo).patch([auth, userValidation("updateUserValidation")], userController.updateUser)

router.post("/users/me/changePassword", [auth, userValidation("changePasswordValidation")], userController.changePassword)

router.route("/users/me/image").post(auth, upload.single("avatar"), userController.setImage).delete(auth, userController.deleteImage)

router.get("/users/:id/avatar", auth, userController.getImage)

router.patch("/users/:id/phoneNumber", auth, userController.deletePhoneNumber)

module.exports = router