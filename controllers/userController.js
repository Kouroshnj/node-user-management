const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const methodsInstance = require("../data/methods")
const path = require("path");
const { controllerMessages, statusCodes } = require("../validations/messages");

class UserController {
    async signUp(req, res) {
        try {
            const user = new userModel(req.body);
            await user.save()
            const token = await user.generateAuthToken()
            const userToken = await userTokens.CreateToken(token, user.userId)
            await userToken.save()
            return res.status(statusCodes.Created).send({ user, token })
        } catch (e) {
            const IsServerError = methodsInstance._mongoServerError(e.code)
            if (IsServerError) {
                return res.status(statusCodes.Conflict).send({ message: `${Object.keys(e.keyValue)} is duplicate` })
            } else {
                res.status(statusCodes.Bad_Request).send({ message: e.message })
            }
        }
    }

    async logIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userModel.findUserByInfo(email, password)
            const token = await user.generateAuthToken()
            const userToken = await userTokens.CreateToken(token, user.userId)
            await userToken.save()
            res.status(statusCodes.OK).send({ user, token })
        } catch (e) {
            res.status(statusCodes.Unauthorized).send({ error: e.message })
        }
    }

    async logOut(req, res) {
        try {
            await userTokens.deleteOne({ token: req.token })
            res.status(statusCodes.Created).send({ message: controllerMessages.User_Log_Out })
        } catch (e) {
            res.status(statusCodes.Not_Found).send({ error: e })
        }
    }

    async userInfo(req, res) {
        res.send()
    }

    async updateUser(req, res) {
        try {
            const updates = Object.keys(req.body)
            for (const update of updates) {
                if (update === "phoneNumber") {
                    const updatePushResult = await methodsInstance._updateOnePush(req.userId, ["phoneNumber"], req.body.phoneNumber)
                    if (updatePushResult.modifiedCount === 0) {
                        return res.status(statusCodes.Conflict).send({ message: controllerMessages.Aready_Available })
                    }
                } else {
                    const updateResult = await methodsInstance._updateOne(req.userId, [update], req.body[update])
                    if (updateResult.modifiedCount === 0) {
                        return res.status(statusCodes.Conflict).send({ message: controllerMessages.Aready_Available })
                    }
                }
            }
            res.status(statusCodes.Created).send(req.user)
        } catch (error) {
            res.status(statusCodes.Conflict).send({ message: error.message })
        }
    }

    async changePassword(req, res) {
        try {
            const user = await userModel.findUserByInfo(req.body.email, req.body.password)
            user.password = req.body.newPassword
            await user.save()
            res.status(statusCodes.Created).send({ message: controllerMessages.Change_Password })
        } catch (e) {
            res.status(statusCodes.Unauthorized).send({ message: e.message })
        }
    }

    async setImage(req, res) {
        req.user.avatar = req.file.originalname
        await req.user.save()
        res.status(statusCodes.Created).send({ message: controllerMessages.Set_Image })
    }

    async deleteImage(req, res) {
        req.user.avatar = undefined
        await req.user.save()
        res.status(statusCodes.Created).send({ message: controllerMessages.Set_Image })
    }

    async getImage(req, res) {
        try {
            const user = await userModel.findById(req.params.id)

            if (!user || !user.avatar) {
                return res.status(statusCodes.Not_Found).send({ message: controllerMessages.Unavailable_Image })
            }

            const root = path.resolve(process.cwd(), "avatars", user.avatar)

            res.sendFile(root, (err) => {
                if (err) {
                    return res.status(statusCodes.Not_Found).send(controllerMessages.Unavailable_Image)
                }
            })
        } catch (e) {
            res.status(statusCodes.Not_Found).send({ message: e.message })
        }
    }
}

const userInstance = new UserController()

module.exports = userInstance