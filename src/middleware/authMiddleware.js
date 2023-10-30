const TokenMethods = require("../services/token.service")
const userTokens = require("../models/userTokens")
const factoryErrorInstance = require("../error/factory.error")
const AuthTokenManager = require("../utils/authTokenManager")


const tokenMethods = new TokenMethods(userTokens)
const authTokenManager = new AuthTokenManager()


const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const tokenPayload = await authTokenManager.verifyAuthToken(token)
        const query = { userId: tokenPayload._userId }
        const userToken = await tokenMethods.findOne(query)
        if (!userToken?.userId) {
            throw factoryErrorInstance.createError("tokenExistence")
        }

        req.sessions = {
            token,
            userId: tokenPayload._userId
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth