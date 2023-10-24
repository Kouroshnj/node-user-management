const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const { hashingPassword, comparePass } = require("../utils/hashAndComparePass")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")
const JwtHandler = require("../utils/jwtUtils")
const path = require("path");
const fs = require("fs")
const { CONTROLLER_MESSAGES } = require("../constant/consts")
const factoryErrorInstance = require("../error/factoryError")
const { imagesDirectory } = require(`../../config/${process.env.NODE_ENV}`)
const { sendOKInputs } = require("../utils/loggerInputs")
const ImageExistence = require("../error/imageExistence.error")



const userService = new UserService(userModel)
const tokenService = new TokenService(userTokens)
const authManagement = new JwtHandler()

class UserController {

    constructor(userService, tokenService, authManagement) {
        this.userService = userService
        this.tokenService = tokenService
        this.authManagement = authManagement
    }

    signUp = async (req, res, next) => {
        try {
            const user = await this.userService.createDocument(req.body)
            const token = await this.authManagement.generateAuthToken(user)
            await this.tokenService.createDocument({ token, userId: user.userId })
            return res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user),
                    token
                },
                message: CONTROLLER_MESSAGES.SIGNUP_SUCCESSFUL,
                userID: user.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            const duplicate = await this.#duplicateError(error)
            next(duplicate)
        }
    }

    logIn = async (req, res, next) => {
        try {
            const { password, ...body } = req.body
            const query = { ...body }

            const user = await this.userService.findOne(query)

            await this.#checkUserExistence(user)

            await comparePass(password, user.password)

            const token = await this.authManagement.generateAuthToken(user)
            await this.tokenService.createDocument({ token, userId: user.userId })
            res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user),
                    token
                },
                message: CONTROLLER_MESSAGES.LOGIN_SUCCESSFUL,
                userID: user.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            next(error)
        }
    }

    logOut = async (req, res, next) => {
        try {
            const query = { token: req.sessions.token }
            const deleteOneResult = await this.tokenService.deleteOne(query)
            await this.#checkModifiedCount(deleteOneResult.deletedCount)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.USER_LOG_OUT_SUCCESSFUL,
                },
                message: CONTROLLER_MESSAGES.USER_LOG_OUT_SUCCESSFUL,
                userID: req.sessions.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    userInfo = async (req, res, next) => {
        try {
            const select = "firstName lastName email parent phoneNumber nationalCode userId avatars"
            const query = { userId: req.sessions.userId }
            const user = await this.userService.findOne(query, select)
            await this.#checkUserExistence(user)
            res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user)
                },
                message: CONTROLLER_MESSAGES.GET_PROFILE_SUCCESSFUL,
                userID: user.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    updateUser = async (req, res, next) => {
        try {
            const userId = req.sessions.userId
            await this.#updateUserPhoneNumber(req.body, userId)
            delete req.body.phoneNumber
            const setQuery = { userId }
            const setOperation = { $set: req.body }
            await this.userService.updateOne(setQuery, setOperation)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.UPDATE_SUCCESS,
                },
                message: CONTROLLER_MESSAGES.UPDATE_SUCCESS,
                userID: userId,
                ...sendOKInputs(req)

            })
        } catch (error) {
            error.userId = req.sessions.userId
            const duplicate = await this.#duplicateError(error)
            next(duplicate)
        }
    }

    removePhoneNumber = async (req, res, next) => {
        try {
            const pullQuery = { userId: req.sessions.userId }
            const pullOperation = { $pull: { phoneNumber: { $in: req.body.phoneNumber } } }
            await this.userService.updateOne(pullQuery, pullOperation)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.PHONENUMBER_DELETE_SUCCESSFUL
                },
                message: CONTROLLER_MESSAGES.PHONENUMBER_DELETE_SUCCESSFUL,
                userID: req.sessions.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    changePassword = async (req, res, next) => {
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
            await this.userService.updateOne(query, operation)
            await this.tokenService.deleteMany(query)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.CHANGE_PASSWORD_SUCCESSFUL
                },
                message: CONTROLLER_MESSAGES.CHANGE_PASSWORD_SUCCESSFUL,
                userID: user.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    setImage = async (req, res, next) => {
        try {
            await this.#checkFileFormat(req.file)
            const query = { userId: req.sessions.userId }
            const operation = { $push: { avatars: req.file.originalname } }
            await this.userService.findOneAndUpdate(query, operation)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.SET_IMAGE_SUCCESSFUL
                },
                message: CONTROLLER_MESSAGES.SET_IMAGE_SUCCESSFUL,
                userID: req.sessions.userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    deleteImage = async (req, res, next) => {
        try {
            const userId = req.sessions.userId
            const query = { userId }
            const fileName = req.params.fileName
            const select = "avatars"
            const user = await this.userService.findOne(query, select)
            await this.#checkUserImageExistence(user, fileName)
            const operation = { $pull: { avatars: fileName } }
            await this.userService.updateOne(query, operation)
            await this.#unlinkImage(imagesDirectory.directory, userId, fileName)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.DELETE_IMAGE_SUCCESSFUL
                },
                message: CONTROLLER_MESSAGES.DELETE_IMAGE_SUCCESSFUL,
                userID: userId,
                ...sendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    getImage = async (req, res, next) => {
        try {
            const query = { userId: req.sessions.userId }
            const select = "userId avatars"
            const user = await this.userService.findOne(query, select)
            const fileName = req.params.fileName
            await this.#checkUserImageExistence(user, fileName)
            const root = path.resolve(imagesDirectory.directory, user.userId, fileName)
            res.sendFile(root, (error) => {
                if (error) {
                    next(new ImageExistence())
                }
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    #userInfoData = (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            parent: user.parent,
            phoneNumber: user.phoneNumber,
            nationalCode: user.nationalCode,
            avatars: user.avatars
        }
    }

    #checkUserExistence = async (user) => {
        if (!user?.userId) {
            throw factoryErrorInstance.factory("userExistence")
            // throw new InvalidCredentials()
        }
    }

    #duplicateError = async (error) => {
        const IsServerError = await this.#mongoServerError(error.code, error.keyValue)
        if (IsServerError.condition) {
            return factoryErrorInstance.factory("duplicate", IsServerError.error)
            // return new DuplicateError(IsServerError.error)
        } else {
            return factoryErrorInstance.factory("duplicate", error.message)
            // return new DuplicateError(error.message)
        }
    }

    #checkUserImageExistence = async (user, fileName) => {
        if (!user.avatars.includes(fileName) || user.avatars.length === 0) {
            throw factoryErrorInstance.factory("imageExistence")
            // throw new ImageExistence()
        }
    }

    #checkFileFormat = async (file) => {
        if (file === undefined) {
            throw factoryErrorInstance.factory("imageFormat")
            // throw new ImageFormatError()
        }
    }

    #mongoServerError = async (value, errorValue) => {
        if (value === 11000) {
            return { condition: true, error: `${Object.keys(errorValue)} which is ${Object.values(errorValue)}, is duplicate` }
        }
        return false
    }
    #unlinkImage = async (imageDirectory, userId, fileName) => {
        try {
            const imagePath = path.resolve(imageDirectory, userId, fileName)
            await fs.promises.unlink(imagePath)
        } catch (error) {
            throw factoryErrorInstance.factory("deleteImage")
        }
    }

    #checkModifiedCount = async (modifiedCount) => {
        if (modifiedCount === 0) {
            throw factoryErrorInstance.factory("collection")
            // throw new CollectionMethodsError()
        }
    }

    #updateUserPhoneNumber = async (body, userId) => {
        if ("phoneNumber" in body) {
            const pushQuery = { userId, phoneNumber: { $nin: body.phoneNumber } }
            const pushOperation = { $push: { phoneNumber: body.phoneNumber } }
            await this.userService.updateOne(pushQuery, pushOperation)
        }
    }

}

const userController = new UserController(userService, tokenService, authManagement)

module.exports = userController