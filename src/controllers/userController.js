const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const { hashingPassword, comparePass } = require("../utils/hashAndComparePass")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const meta = require("../constant/meta")
const path = require("path");
const fs = require("fs")
const bcrypt = require("bcryptjs")
const { statusCodes, controllerMessages } = require("../constant/consts")
const { imagesDirectory } = require("../../config/config")


const userService = new UserService(userModel)
const tokenService = new TokenService(userTokens)
const authManagement = new AuthManagement()

class UserController {

    signUp = async (req, res) => {
        try {
            const user = await userService.createDocument(req.body)
            const token = await authManagement.generateAuthToken(user)
            await tokenService.createDocument({ token, userId: user.userId })
            return res.status(statusCodes.CREATED).send({ data: this.#userInfoData(user), token, meta })
        } catch (error) {
            await this.#duplicateError(error, res)
        }
    }

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;
            const query = { email }

            const user = await userService.findOne(query)

            await this.#checkUserExistence(user)

            await comparePass(password, user.password)

            const token = await authManagement.generateAuthToken(user)
            await tokenService.createDocument({ token, userId: user.userId })
            res.status(statusCodes.OK).send({ data: this.#userInfoData(user), token, meta })
        } catch (error) {
            res.status(statusCodes.UNAUTHORIZED).send({ data: error.message, meta })
        }
    }

    logOut = async (req, res) => {
        try {
            const query = { token: req.sessions.token }
            await tokenService.deleteOne(query)
            res.status(statusCodes.OK).send({ data: controllerMessages.USER_LOG_OUT_SUCCESSFUL, meta })
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ data: error.message, meta })
        }
    }

    userInfo = async (req, res) => {
        try {
            const select = "firstName lastName parent phoneNumber nationalCode userId avatars"
            const query = { userId: req.sessions.userId }
            const user = await userService.findOne(query, select)
            await this.#checkUserExistence(user)
            return res.status(statusCodes.OK).send({ data: this.#userInfoData(user), meta })
        } catch (error) {
            res.status(statusCodes.NOT_FOUND).send({ data: error.message, meta })
        }
    }

    updateUser = async (req, res) => {
        try {
            await this.#updateHandler(req.body, req.sessions.userId)
            res.status(statusCodes.OK).send({ data: controllerMessages.UPDATE_SUCCESS, meta })
        } catch (error) {
            await this.#duplicateError(error, res)
        }
    }

    removePhoneNumber = async (req, res) => {
        try {
            const pullQuery = { userId: req.sessions.userId }
            const pullOperation = { $pull: { phoneNumber: { $in: req.body.phoneNumber } } }
            await userService.updateOne(pullQuery, pullOperation)
            res.status(statusCodes.OK).send({ data: controllerMessages.PHONENUMBER_DELETE_SUCCESSFUL, meta })
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ data: error.message, meta })
        }
    }

    changePassword = async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body
            const query = { userId: req.sessions.userId }
            const select = "password userId"

            const user = await userService.findOne(query, select)
            await this.#checkUserExistence(user)
            const oldHashedPassword = user.password

            await comparePass(oldPassword, oldHashedPassword)

            const newHashedPassword = await hashingPassword(newPassword)

            const operation = { $set: { password: newHashedPassword } }
            await userService.updateOne(query, operation)
            await tokenService.deleteMany(query)
            res.status(statusCodes.OK).send({ data: controllerMessages.CHANGE_PASSWORD_SUCCESSFUL, meta })
        } catch (error) {
            res.status(statusCodes.BAD_REQUEST).send({ data: error.message, meta })
        }
    }

    setImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const operation = { $push: { avatars: req.file.originalname } }
            await userService.findOneAndUpdate(query, operation)
            res.status(statusCodes.OK).send({ data: controllerMessages.SET_IMAGE_SUCCESSFUL, meta })
        } catch (error) {
            res.status(statusCodes.UNPROCESSABLE).send({ data: error.message, meta })
        }
    }

    deleteImage = async (req, res) => {
        try {
            const userId = req.sessions.userId
            const query = { userId }
            const fileName = req.params.fileName
            const select = "avatars"
            const user = await userService.findOne(query, select)
            await this.#checkUserImageExistence(user, fileName)
            const operation = { $pull: { avatars: fileName } }
            await userService.updateOne(query, operation)
            const imagePath = path.resolve(imagesDirectory.directory, userId, fileName)
            fs.unlink(imagePath, (error) => {
                if (error) {
                    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ data: controllerMessages.DELETE_IMAGE_ERROR })
                }
            })
            res.status(statusCodes.OK).send({ data: controllerMessages.DELETE_IMAGE_SUCCESSFUL, meta })
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ data: error.message, meta })
        }
    }

    getImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const select = "userId avatars"
            const user = await userService.findOne(query, select)
            const fileName = req.params.fileName

            await this.#checkUserImageExistence(user, fileName)

            const root = path.resolve(imagesDirectory.directory, user.userId, fileName)
            res.sendFile(root, (err) => {
                if (err) {
                    return res.status(statusCodes.NOT_FOUND).send({ data: controllerMessages.UNAVAILABE_IMAGE, meta })
                }
            })
        } catch (error) {
            res.status(statusCodes.NOT_FOUND).send({ data: error.message, meta })
        }
    }

    #updateHandler = async (body, userId) => {
        if ("phoneNumber" in body) {
            const pushQuery = { userId, phoneNumber: { $nin: body.phoneNumber } }
            const pushOperation = { $push: { phoneNumber: body.phoneNumber } }
            await userService.updateOne(pushQuery, pushOperation)
        }
        delete body.phoneNumber
        const setQuery = { userId }
        const setOperation = { $set: body }
        await userService.updateOne(setQuery, setOperation)
    }

    #userInfoData = (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            parent: user.parent,
            phoneNumber: user.phoneNumber,
            nationalCode: user.nationalCode,
            avatars: user.avatars
        }
    }

    #checkUserExistence = async (user) => {
        if (!user?.userId) {
            throw new Error(controllerMessages.EMAIL_PASS_WRONG)
        }
    }

    #duplicateError = async (error, response) => {
        const IsServerError = this.#mongoServerError(error.code, error.keyValue)
        if (IsServerError.condition) {
            return response.status(statusCodes.CONFLICT).send({
                data: IsServerError.error,
                meta
            })
        } else {
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ data: error.message, meta })
        }
    }

    #checkUserImageExistence = async (user, fileName) => {
        if (!user.avatars.includes(fileName) || user.avatars.length === 0) {
            throw new Error(controllerMessages.UNAVAILABE_IMAGE)
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