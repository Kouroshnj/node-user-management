const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const UserMethods = require("../services/user.service")
const TokenMethods = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const path = require("path");
const bcrypt = require("bcryptjs")
const { statusCodes, controllerMessages } = require("../constant/consts")


const userMethods = new UserMethods(userModel)
const tokenMethods = new TokenMethods(userTokens)
const authManagement = new AuthManagement()

class UserController {

    signUp = async (req, res) => {
        try {
            const user = await userMethods.createUser(req.body)
            await user.save()
            const token = await authManagement.generateAuthToken(user)
            const userToken = await tokenMethods.createToken(token, user.userId)
            await userToken.save()
            return res.status(statusCodes.Created).send({ userInfo: this.#userInfoData(user), token })
        } catch (error) {
            await this.#duplicateError(error, res)
        }
    }

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;
            const query = { email }

            const user = await userMethods.findOne(query)

            await this.#userNotFound(user)

            await this.#comparePass(password, user.password)

            const token = await authManagement.generateAuthToken(user)
            const userToken = await tokenMethods.createToken(token, user.userId)
            await userToken.save()
            res.status(statusCodes.OK).send({ user: this.#userInfoData(user), token })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    logOut = async (req, res) => {
        try {
            const query = { token: req.sessions.token }
            await tokenMethods.deleteOne(query)
            res.status(statusCodes.Created).send({ message: controllerMessages.User_Log_Out })
        } catch (error) {
            res.status(statusCodes.Not_Found).send({ message: error.message })
        }
    }

    userInfo = async (req, res) => {
        try {
            const select = "firstName lastName parent phoneNumber nationalCode"
            const query = { userId: req.sessions.userId }
            const user = await userMethods.findOne(query, select)
            await this.#userNotFound(user)
            return res.status(statusCodes.OK).send(user)
        } catch (error) {
            res.status(statusCodes.Not_Found).send({ message: error.message })
        }
    }

    updateUser = async (req, res) => {
        try {
            await this.#updateHandler(req.body, req.sessions.userId)
            res.status(statusCodes.Created).send({ message: controllerMessages.Update_Success })
        } catch (error) {
            await this.#duplicateError(error, res)
        }
    }

    removePhoneNumber = async (req, res) => {
        try {
            await this.#removePhoneNumber(req.body.phoneNumber, req.sessions.userId)
            res.status(statusCodes.Created).send({ message: controllerMessages.PhoneNumber_Delete })
        } catch (error) {
            res.status(statusCodes.Not_Acceptable).send({ message: error.message })
        }
    }

    changePassword = async (req, res) => {
        try {
            const { email, oldPassword } = req.body
            const query = { email }
            const select = "email password"

            const user = await userMethods.findOne(query, select)
            await this.#userNotFound(user)
            const oldHashedPassword = await user.password

            await this.#comparePass(oldPassword, oldHashedPassword)

            const hashedPassword = await this.#generatePassword(req.body.newPassword)

            const operation = { $set: { password: hashedPassword } }
            await userMethods.updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Change_Password })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    setImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const operation = { $set: { avatar: req.file.originalname } }
            await userMethods.findOneAndUpdate(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Set_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    deleteImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const operation = { $unset: { avatar: "" } }
            await userMethods.updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Delete_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    getImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }

            const user = await userMethods.findOne(query)

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

    #updateHandler = async (requestBody, requestUserId) => {
        if ("phoneNumber" in requestBody) {
            const pushQuery = { userId: requestUserId, phoneNumber: { $nin: requestBody.phoneNumber } }
            const pushOperation = { $push: { phoneNumber: requestBody.phoneNumber } }
            await userMethods.updateOne(pushQuery, pushOperation)
        }
        delete requestBody.phoneNumber
        const setQuery = { userId: requestUserId }
        const setOperation = { $set: requestBody }
        await userMethods.updateOne(setQuery, setOperation)
    }

    #removePhoneNumber = async (phoneNumbers, requestUserId) => {
        const pullQuery = { userId: requestUserId }
        const pullOperation = { $pull: { phoneNumber: { $in: phoneNumbers } } }
        await userMethods.updateOne(pullQuery, pullOperation)
    }

    #userInfoData = (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            parent: user.parent,
            phoneNumber: user.phoneNumber,
            nationalCode: user.nationalCode
        }
    }

    #comparePass = async (oldPassword, oldHashedPassword) => {
        const isValid = await bcrypt.compare(oldPassword, oldHashedPassword)

        if (!isValid) {
            throw new Error(controllerMessages.Email_Pass_Wrong)
        }
    }

    #generatePassword = async (password) => {

        const salt = await bcrypt.genSalt(8)
        const hashedPass = await bcrypt.hash(password, salt)

        return hashedPass
    }

    async #userNotFound(user) {
        if (!user || user == null) {
            throw new Error(controllerMessages.User_Not_Found)
        }
    }

    #duplicateError = async (error, response) => {
        const IsServerError = this.#mongoServerError(error.code, error.keyValue)
        if (IsServerError.condition) {
            return response.status(statusCodes.Conflict).send({
                message: IsServerError.error
            })
        } else {
            response.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }


    #mongoServerError = (value, errorValue) => {
        if (value === 11000) {
            return { condition: true, error: `${Object.keys(errorValue)} which is ${Object.values(errorValue)}, is duplicate` }
        }
        return false
    }


}

module.exports = UserController