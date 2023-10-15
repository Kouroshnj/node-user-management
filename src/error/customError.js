const { getUnixTimestamp } = require("../utils/getDate")

class customErrorHandling extends Error {
    constructor(message, statusCode, errorCode) {
        super(message)
        this.statusCode = statusCode || 500
        this.timestamp = getUnixTimestamp()
        this.errorCode = errorCode || "INTERNAL_SEVER_ERROR"

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = customErrorHandling