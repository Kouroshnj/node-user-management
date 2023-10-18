const express = require("express");
const auth = require("../middleware/auth")
const setLimitter = require("../middleware/rateLimit")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validate")
const upload = require("../middleware/upload");

const router = express.Router()

const userController = new UserController()


router.route("/")
    .get([auth, setLimitter], userController.userInfo)
    .patch([auth, setLimitter, validation("updateUserValidation")], userController.updateUser)

router.delete("/phoneNumber", [auth, setLimitter, validation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/changePassword", [auth, validation("changePasswordValidation")], userController.changePassword)

router.post("/image", auth, upload.single("avatar"), userController.setImage)

router.route("/image/:fileName")
    .get(auth, userController.getImage)
    .delete(auth, userController.deleteImage)

module.exports = router