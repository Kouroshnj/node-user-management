const TokenMethods = require("../services/token.service")
const JwtHandler = require("../utils/jwtUtils")
const userTokens = require("../models/userTokens")
const TokenExistenceError = require("../error/tokenExistence.error")


const tokenMethods = new TokenMethods(userTokens)
const authManagement = new JwtHandler()


const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const tokenPayload = await authManagement.verifyAuthToken(token)
        const query = { userId: tokenPayload._userId }
        const userToken = await tokenMethods.findOne(query)
        if (!userToken?.userId) {
            throw new TokenExistenceError()
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