const express = require("express");
const auth = require("../middleware/auth")
const UserController = require("../controllers/userController")
const validation = require("../middleware/validate")
const upload = require("../middleware/upload");

const router = express.Router()

const userController = new UserController()


router.route("/")
    .get(auth, userController.userInfo)
    .patch([auth, validation("updateUserValidation")], userController.updateUser)

router.delete("/phoneNumber", [auth, validation("deletePhoneNumberValidation")], userController.removePhoneNumber)

router.patch("/changePassword", [auth, validation("changePasswordValidation")], userController.changePassword)

router.post("/image", auth, upload.single("avatar"), userController.setImage)

router.route("/image/:fileName")
    .get(auth, validation("imageParamValidation"), userController.getImage)
    .delete(auth, validation("imageParamValidation"), userController.deleteImage)


module.exports = router