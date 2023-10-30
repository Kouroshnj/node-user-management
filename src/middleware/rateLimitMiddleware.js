const { rateLimit } = require("express-rate-limit")
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")

const limitterErrorHandler = (message, request) => {
    return {
        message,
        statusCode: STATUSCODES.TOO_MANY_REQUESTS,
        errorCode: ERROR_CODES.TOO_MANY_REQUESTS,
        userID: request.sessions.userId
    }
}


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2,
    message: CONTROLLER_MESSAGES.TOO_MANY_REQUESTS,
    handler(req, res, next) {
        next(limitterErrorHandler(this.message, req))
    }
})

module.exports = limiter