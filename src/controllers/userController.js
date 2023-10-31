const ImageExistence = require("../error/imageExistence.error")
const { hashingPassword, comparePass } = require("../utils/passwordUtils")
const { CONTROLLER_MESSAGES } = require("../constant/consts")
const { imagesDirectory } = require(`../../config/${process.env.NODE_ENV}`)
const { setSendOKInputs } = require("../utils/loggerInputs")
const factoryErrorInstance = require("../error/factory.error")
const path = require("path");
const fs = require("fs")


class UserController {

    constructor(userService, tokenService, authTokenManager) {
        this.userService = userService
        this.tokenService = tokenService
        this.authTokenManager = authTokenManager
        if (!UserController.instance) {
            UserController.instance = this
        }

        return UserController.instance
    }

    signUp = async (req, res, next) => {
        try {
            const user = await this.userService.createDocument(req.body)
            const token = await this.authTokenManager.generateAuthToken(user)
            await this.tokenService.createDocument({ token, userId: user.userId })
            return res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user.toObject()),
                    token
                },
                message: CONTROLLER_MESSAGES.SIGNUP_SUCCESSFUL,
                userID: user.userId,
                ...setSendOKInputs(req)
            })
        } catch (error) {
            const duplicate = await this.#handleMongoDBError(error)
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

            const token = await this.authTokenManager.generateAuthToken(user)
            await this.tokenService.createDocument({ token, userId: user.userId })
            res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user),
                    token
                },
                message: CONTROLLER_MESSAGES.LOGIN_SUCCESSFUL,
                userID: user.userId,
                ...setSendOKInputs(req)
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
                ...setSendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    userInfo = async (req, res, next) => {
        try {
            const select = "firstName lastName email parent phoneNumber nationalCode avatars userId"
            const query = { userId: req.sessions.userId }
            const user = await this.userService.findOne(query, select)
            await this.#checkUserExistence(user)
            res.sendOK({
                returnValue: {
                    userInfo: this.#userInfoData(user)
                },
                message: CONTROLLER_MESSAGES.GET_PROFILE_SUCCESSFUL,
                userID: user.userId,
                ...setSendOKInputs(req)
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
                ...setSendOKInputs(req)

            })
        } catch (error) {
            error.userId = req.sessions.userId
            const duplicate = await this.#handleMongoDBError(error)
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
                ...setSendOKInputs(req)
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

            const user = await this.userService.findOne(query, select)
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
                ...setSendOKInputs(req)
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
                ...setSendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    deleteImage = async (req, res, next) => {
        try {
            const userId = req.sessions.userId
            const fileName = req.params.fileName
            const query = { userId, avatars: { $in: fileName } }
            const select = "avatars"
            const user = await this.userService.findOne(query, select)
            await this.#checkUserImageExistence(user)
            const operation = { $pull: { avatars: fileName } }
            await this.userService.updateOne(query, operation)
            await this.#unlinkImage(imagesDirectory.directory, userId, fileName)
            res.sendOK({
                returnValue: {
                    message: CONTROLLER_MESSAGES.DELETE_IMAGE_SUCCESSFUL
                },
                message: CONTROLLER_MESSAGES.DELETE_IMAGE_SUCCESSFUL,
                userID: userId,
                ...setSendOKInputs(req)
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    getImage = async (req, res, next) => {
        try {
            const userId = req.sessions.userId
            const fileName = req.params.fileName
            const query = { userId, avatars: { $in: fileName } }
            const select = "userId avatars"
            const user = await this.userService.findOne(query, select)
            await this.#checkUserImageExistence(user)
            const root = path.resolve(imagesDirectory.directory, user.userId, fileName)
            res.sendFile(root, (error) => {
                if (error) {
                    next(new ImageExistence(user.userId))
                }
            })
        } catch (error) {
            error.userId = req.sessions.userId
            next(error)
        }
    }

    #userInfoData = (user) => {
        const { password, _id, userId, __v, ...userInfo } = user
        return userInfo
    }

    #checkUserExistence = async (user) => {
        if (!user?.userId) {
            throw factoryErrorInstance.createError("userExistence")
        }
    }

    #handleMongoDBError = async (error) => {
        const IsServerError = await this.#mongoServerError(error.code, error.keyValue)
        if (IsServerError.condition) {
            return factoryErrorInstance.createError("duplicateError", IsServerError.error)
            // return factoryErrorInstance.factory("duplicate", IsServerError.error)
        } else {
            return factoryErrorInstance.createError("serverError", error.message)
        }
    }

    #checkUserImageExistence = async (user) => {
        if (user == null) {
            throw factoryErrorInstance.createError("imageExistence")
        }
    }

    #checkFileFormat = async (file) => {
        if (file === undefined) {
            throw factoryErrorInstance.createError("imageFormatError")
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
            return factoryErrorInstance.createError("deleteImageError")
        }
    }

    #checkModifiedCount = async (modifiedCount) => {
        if (modifiedCount === 0) {
            throw factoryErrorInstance.createError("collectionError")
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

module.exports = UserController
