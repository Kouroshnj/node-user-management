const express = require("express");
const auth = require("../middleware/auth")
const userController = require("../controllers/userController")
const upload = require("../middleware/upload")

const router = express.Router()


router.post("/users/Signup", userController.Signup)

router.post("/users/Login", userController.Login)

router.post("/users/Logout", auth, userController.Logout)

router.get("/users/me", auth, userController.userInfo)

router.patch("/users/me", auth, userController.updateUser)

router.post("/users/me/changePassword", auth, userController.changePassword)

router.post("/users/me/image", auth, upload.single("avatar"), userController.setImage)

router.delete("/users/me/image", auth, userController.deleteImage)

router.get("/users/:id/avatar", auth, userController.getImage)

module.exports = router