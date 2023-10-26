const express = require("express");
const auth = require("../middleware/authMiddleware")
const setLimitter = require("../middleware/rateLimitMiddleware")
const userController = require("../controllers/userController")
const validation = require("../middleware/validateMiddleware")
const upload = require("../middleware/uploadMiddleware");


const router = express.Router()

router.route("/")
    .get([auth, setLimitter], userController.userInfo)
    .patch([auth, validation("updateUserValidation")], userController.updateUser)

router.delete("/phoneNumber", [auth, setLimitter, validation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/changePassword", [auth, validation("changePasswordValidation")], userController.changePassword)

router.post("/image", auth, upload.single("avatar"), userController.setImage)

router.route("/image/:fileName")
    .get([auth, setLimitter], userController.getImage)
    .delete(auth, userController.deleteImage)

module.exports = router