const jwt = require("jsonwebtoken");
const { authMessages, statusCodes } = require("../validations/messages");
const Methods = require("../services/methods.service")
const userModel = require("../models/users");
const userTokens = require("../models/userTokens")

const userMethods = new Methods(userModel)
const tokenMethods = new Methods(userTokens)

const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verificationStatus = await jwt.verify(token, process.env.SECRET_KEY)
        const query = { userId: verificationStatus._userId }
        const query2 = { owner: verificationStatus._userId }
        const [userInfo, userToken] = await Promise.all([
            userMethods._findOne(query),
            tokenMethods._findOne(query2),
        ])
        if (!userToken || userToken == null) {
            return res.status(statusCodes.Not_Found).send({ message: authMessages.User_Not_Found })
        }

        if (!userInfo) {
            return res.status(statusCodes.Not_Found).send({ message: authMessages.User_Not_Found })
        }
        req.token = token
        req.userId = verificationStatus._userId
        req.user = userInfo
        next()
    } catch (e) {
        res.status(statusCodes.Not_Found).send({ error: e.message })
    }
}

module.exports = auth