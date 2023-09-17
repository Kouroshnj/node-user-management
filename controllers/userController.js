const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const path = require("path");
const { controllerMessages } = require("../validations/errorMessage");

class UserController {
    async signUp(req, res) {
        try {
            const user = new userModel(req.body);
            const token = await user.generateAuthToken()
            await user.save()
            const userToken = await userTokens.CreateToken(token, user._id)
            await userToken.save()
            return res.status(201).send({ user, token })
        } catch (e) {
            res.status(400).send({ message: e.message })
        }
    }

    async logIn(req, res) {
        try {
            const user = await userModel.findUserByInfo(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            const userToken = await userTokens.CreateToken(token, user._id)
            await userToken.save()
            res.status(201).send({ user, token })
        } catch (e) {
            res.status(401).send({ error: e.message })
        }
    }

    async logOut(req, res) {
        try {
            await userTokens.deleteOne({ token: req.token })
            res.status(201).send({ message: controllerMessages.User_Log_Out })
        } catch (e) {
            res.status(404).send({ error: e })
        }
    }

    async userInfo(req, res) {
        res.send(req.user)
    }

    async updateUser(req, res) {
        try {
            await req.user.save()
            res.status(201).send(req.user)
        } catch (e) {
            res.status(400).send({ message: e.message })
        }
    }

    async changePassword(req, res) {
        try {
            const user = await userModel.findUserByInfo(req.body.email, req.body.password)
            user.password = req.body.newPassword
            await user.save()
            res.status(201).send({ message: controllerMessages.Change_Password })
        } catch (e) {
            res.status(401).send({ message: e.message })
        }
    }

    async setImage(req, res) {
        req.user.avatar = req.file.originalname
        await req.user.save()
        res.status(201).send({ message: controllerMessages.Set_Image })
    }

    async deleteImage(req, res) {
        req.user.avatar = undefined
        await req.user.save()
        res.status(201).send({ message: controllerMessages.Set_Image })
    }

    async getImage(req, res) {
        try {
            const user = await userModel.findById(req.params.id)

            if (!user || !user.avatar) {
                return res.status(404).send({ message: controllerMessages.Unavailable_Image })
            }

            const root = path.resolve(process.cwd(), "avatars", user.avatar)

            res.sendFile(root, (err) => {
                if (err) {
                    return res.status(404).send(controllerMessages.Unavailable_Image)
                }
            })
        } catch (e) {
            res.status(404).send({ message: e.message })
        }
    }
}

const userInstance = new UserController()

module.exports = userInstance