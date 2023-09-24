const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const Methods = require("../services/methods.service")
const Management = require("../utils/manage")
const path = require("path");
const bcrypt = require("bcryptjs")
const { controllerMessages, statusCodes, userModelErrors } = require("../validations/messages");

const userMethods = new Methods(userModel)
const tokenMethods = new Methods(userTokens)
const manageInstance = new Management(userModel)

class UserController {

    async signUp(req, res) {
        try {
            const user = await userMethods._createUser(req.body)
            await user.save()
            const token = await manageInstance._generateAuthToken(user)
            const userToken = await tokenMethods._createToken(token, user.userId)
            await userToken.save()
            return res.status(statusCodes.Created).send({ user, token })
        } catch (error) {
            const IsServerError = manageInstance._mongoServerError(error.code, error.keyValue)
            if (IsServerError.condition) {
                return res.status(statusCodes.Conflict).send({
                    message: IsServerError.error
                })
            } else {
                res.status(statusCodes.Bad_Request).send({ message: error.message })
            }
        }
    }

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;
            const query = { email }
            const user = await userMethods._findByInfo(query, password)
            const token = await manageInstance._generateAuthToken(user)
            const userToken = await tokenMethods._createToken(token, user.userId)
            await userToken.save()
            res.status(statusCodes.OK).send({ user: this.#userInfoData(user), token })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    async logOut(req, res) {
        try {
            const query = { token: req.token }
            await tokenMethods._deleteOne(query)
            res.status(statusCodes.Created).send({ message: controllerMessages.User_Log_Out })
        } catch (error) {
            res.status(statusCodes.Not_Found).send({ message: error.message })
        }
    }

    userInfo = async (req, res) => {
        try {
            const user = await userMethods._findOne({ userId: req.userId })
            return res.status(statusCodes.OK).send(this.#userInfoData(user))
        } catch (error) {
            res.status(statusCodes.Not_Found).send({ message: error.message })
        }
    }

    updateUser = async (req, res) => {
        try {
            await this.#updateHandler(req.body, req.userId)
            res.status(statusCodes.Created).send({ message: controllerMessages.Update_Success })
        } catch (error) {
            const IsServerError = this._mongoServerError(error.code, error.keyValue)
            if (IsServerError.condition) {
                return res.status(statusCodes.Conflict).send({
                    message: IsServerError.error
                })
            } else {
                res.status(statusCodes.Bad_Request).send({ message: error.message })
            }
        }
    }

    removePhoneNumber = async (req, res) => {
        try {
            await this.#removePhoneNumber(req.body.phoneNumber, req.userId)
            res.status(statusCodes.Created).send({ message: controllerMessages.PhoneNumber_Delete })
        } catch (error) {
            res.status(statusCodes.Not_Acceptable).send({ message: error.message })
        }
    }

    changePassword = async (req, res) => {
        try {
            const { email } = req.body
            const query = { email }

            const hashedPassword = await this.#generateNewPass(req.body)

            const operation = { $set: { password: hashedPassword } }
            await userMethods._updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Change_Password })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    setImage = async (req, res) => {
        try {
            const query = { userId: req.userId }
            const operation = { $set: { avatar: req.file.originalname } }
            await userMethods._findOneAndUpdate(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Set_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    async deleteImage(req, res) {
        try {
            const query = { userId: req.userId }
            const operation = { $unset: { avatar: "" } }
            await userMethods._updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Delete_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    async getImage(req, res) {
        try {
            const query = { userId: req.userId }

            const user = await userMethods._findOne(query)

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

    async #updateHandler(reqBody, reqUserId) {
        if ("phoneNumber" in reqBody) {
            const pushQuery = { userId: reqUserId, phoneNumber: { $nin: reqBody.phoneNumber } }
            const pushOperation = { $push: { phoneNumber: reqBody.phoneNumber } }
            await userMethods._updateOne(pushQuery, pushOperation)
        }
        delete reqBody.phoneNumber
        const setQuery = { userId: reqUserId }
        const setOperation = { $set: reqBody }
        await userMethods._updateOne(setQuery, setOperation)
    }

    async #removePhoneNumber(phoneNumbers, reqUserId) {
        const pullQuery = { userId: reqUserId }
        const pullOperation = { $pull: { phoneNumber: { $in: phoneNumbers } } }
        await userMethods._updateOne(pullQuery, pullOperation)
    }

    #userInfoData(user) {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            parent: user.parent,
            nationalCode: user.nationalCode
        }
    }

    #comparePass = async (email, oldPassword) => {
        const query = { email }
        const user = await userMethods._findOne(query)
        const hashPass = await user.password
        const isValid = await bcrypt.compare(oldPassword, hashPass)

        return isValid
    }

    #generateNewPass = async (reqBody) => {
        const { email, oldPassword, newPassword } = reqBody
        const isValid = await this.#comparePass(email, oldPassword)


        if (!isValid) {
            throw new Error(userModelErrors.Email_Pass_Wrong)
        }

        const salt = await bcrypt.genSalt(8)
        const hashedPass = await bcrypt.hash(newPassword, salt)

        return hashedPass
    }
}

const userInstance = new UserController()

module.exports = userInstance