const customErrorHandling = require("./customError")
const { statusCodes, errorCodes } = require("../constant/consts")


class DuplicateError extends customErrorHandling {
    constructor(message, userId) {
        super(message, statusCodes.CONFLICT, errorCodes.CONFLICT)
        this.userId = userId
    }
}

module.exports = DuplicateError