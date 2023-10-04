const { statusCodes, authMessages } = require("../constant/consts")
const TokenMethods = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const userTokens = require("../models/userTokens")
const meta = require("../constant/meta")


const tokenMethods = new TokenMethods(userTokens)
const authManagement = new AuthManagement()


const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const tokenPayload = await authManagement.verifyAuthToken(token)
        const query = { userId: tokenPayload._userId }
        const [userToken] = await Promise.all([
            tokenMethods.findOne(query),
        ])
        if (!userToken?.userId) {
            return res.status(statusCodes.NOT_FOUND).send({ data: authMessages.TOKEN_NOT_EXIST, meta })

        }

        req.sessions = {
            token,
            userId: tokenPayload._userId
        }
        next()
    } catch (error) {
        res.status(statusCodes.NOT_FOUND).send({ data: error.message, meta })
    }
}

module.exports = auth