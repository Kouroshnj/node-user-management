const express = require("express");
const auth = require("../middleware/auth")
const updateValidation = require("../middleware/updateValidation")
const userController = require("../controllers/userController")
const userValidation = require("../middleware/validate")
const upload = require("../middleware/upload")

const router = express.Router()


router.post("/users/Signup", userValidation("userValidation"), userController.Signup)

router.post("/users/Login", userValidation("LoginValidation"), userController.Login)

router.post("/users/Logout", auth, userController.Logout)

router.route("/users/me").get(auth, userController.Userinfo).patch([auth, updateValidation, userValidation("updateUserValidation")], userController.Updateuser)

router.post("/users/me/changePassword", [auth, userValidation("changePasswordValidation")], userController.Changepassword)

router.route("/users/me/image").post(auth, upload.single("avatar"), userController.Setimage).delete(auth, userController.Deleteimage)

router.get("/users/:id/avatar", auth, userController.Getimage)

module.exports = router