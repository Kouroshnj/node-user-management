const { statusCodes, authMessages } = require("../constant/consts")
const UserMethods = require("../services/user.service")
const TokenMethods = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const userModel = require("../models/users");
const userTokens = require("../models/userTokens")

const userMethods = new UserMethods(userModel)
const tokenMethods = new TokenMethods(userTokens)
const authManagement = new AuthManagement()


const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verificationStatus = await authManagement.verifyAuthToken(token)
        const query = { userId: verificationStatus._userId }
        const [userInfo, userToken] = await Promise.all([
            userMethods.findOne(query),
            tokenMethods.findOne(query),
        ])
        if (!userToken || userToken == null || !userInfo) {
            return res.status(statusCodes.Not_Found).send({ message: authMessages.User_Not_Found })
        }

        req.sessions = {
            token,
            userInfo,
            userId: verificationStatus._userId
        }
        next()
    } catch (e) {
        res.status(statusCodes.Not_Found).send({ error: e.message })
    }
}

module.exports = auth