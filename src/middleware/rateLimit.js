const { rateLimit } = require("express-rate-limit")
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")

const errorHandler = (message, request) => {
    return {
        message,
        statusCode: statusCodes.TOO_MANY_REQUESTS,
        errorCode: errorCodes.TOO_MANY_REQUESTS,
        userID: request.sessions.userId
    }
}


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2,
    message: controllerMessages.TOO_MANY_REQUESTS,
    handler(req, res, next) {
        next(errorHandler(this.message, req))
    }
})

module.exports = limiter