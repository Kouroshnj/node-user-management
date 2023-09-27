const { statusCodes, authMessages } = require("../constant/consts")
const TokenMethods = require("../services/token.service")
const AuthManagement = require("../utils/authManagement")
const userTokens = require("../models/userTokens")


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
        if (!userToken || userToken == null) {
            return res.status(statusCodes.Not_Found).send({ message: authMessages.Not_Exist })
        }

        req.sessions = {
            token,
            userId: tokenPayload._userId
        }
        next()
    } catch (e) {
        res.status(statusCodes.Not_Found).send({ error: e.message })
    }
}

module.exports = auth