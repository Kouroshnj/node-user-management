const express = require("express");
const auth = require("../middleware/auth")
const userController = require("../controllers/userController")
const upload = require("../middleware/upload")

const router = express.Router()


router.post("/users/Signup", userController.Signup)

router.post("/users/Login", userController.Login)

router.post("/users/Logout", auth, userController.Logout)

router.route("/users/me").get(auth, userController.userInfo).patch(auth, userController.updateUser)

router.post("/users/me/changePassword", auth, userController.changePassword)

router.route("/users/me/image").post(auth, upload.single("avatar"), userController.setImage).delete(auth, userController.deleteImage)

router.get("/users/:id/avatar", auth, userController.getImage)

module.exports = router