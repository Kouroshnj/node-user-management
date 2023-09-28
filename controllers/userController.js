const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const hashingPassword = require("../utils/hashingPass")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const path = require("path");
const bcrypt = require("bcryptjs")
const { statusCodes, controllerMessages } = require("../constant/consts")


const userService = new UserService(userModel)
const tokenService = new TokenService(userTokens)
const authManagement = new AuthManagement()

class UserController {

    signUp = async (req, res) => {
        try {
            const user = await userService.createDocument(req.body)
            const token = await authManagement.generateAuthToken(user)
            await tokenService.createDocument({ token, userId: user.userId })
            return res.status(statusCodes.Created).send({ userInfo: this.#userInfoData(user), token })
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

            await this.#comparePass(password, user.password)

            const token = await authManagement.generateAuthToken(user)
            await tokenService.createDocument({ token, userId: user.userId })
            res.status(statusCodes.OK).send({ user: this.#userInfoData(user), token })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    logOut = async (req, res) => {
        try {
            const query = { token: req.sessions.token }
            await tokenService.deleteOne(query)
            res.status(statusCodes.Created).send({ message: controllerMessages.User_Log_Out })
        } catch (error) {
            res.status(statusCodes.Not_Found).send({ message: error.message })
        }
    }

    userInfo = async (req, res) => {
        try {
            const select = "firstName lastName parent phoneNumber nationalCode userId"
            const query = { userId: req.sessions.userId }
            const user = await userService.findOne(query, select)
            await this.#checkUserExistence(user)
            return res.status(statusCodes.OK).send(this.#userInfoData(user))
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
            const pullQuery = { userId: req.sessions.userId }
            const pullOperation = { $pull: { phoneNumber: { $in: req.body.phoneNumber } } }
            await userService.updateOne(pullQuery, pullOperation)
            res.status(statusCodes.Created).send({ message: controllerMessages.PhoneNumber_Delete })
        } catch (error) {
            res.status(statusCodes.Not_Acceptable).send({ message: error.message })
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

            await this.#comparePass(oldPassword, oldHashedPassword)

            const newHashedPassword = await hashingPassword(newPassword)

            const operation = { $set: { password: newHashedPassword } }
            await userService.updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Change_Password_Successful })
        } catch (error) {
            res.status(statusCodes.Unauthorized).send({ message: error.message })
        }
    }

    setImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const operation = { $set: { avatar: req.file.originalname } }
            await userService.findOneAndUpdate(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Set_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    deleteImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }
            const operation = { $unset: { avatar: "" } }
            await userService.updateOne(query, operation)
            res.status(statusCodes.Created).send({ message: controllerMessages.Delete_Image })
        } catch (error) {
            res.status(statusCodes.Bad_Request).send({ message: error.message })
        }
    }

    getImage = async (req, res) => {
        try {
            const query = { userId: req.sessions.userId }

            const user = await userService.findOne(query)


            if (!user?.avatar) {
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
            nationalCode: user.nationalCode
        }
    }

    #comparePass = async (oldPassword, oldHashedPassword) => {
        const isValid = await bcrypt.compare(oldPassword, oldHashedPassword)

        if (!isValid) {
            throw new Error(controllerMessages.Change_Password_Error)
        }
    }

    #checkUserExistence = async (user) => {
        if (!user?.userId) {
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