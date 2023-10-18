const customErrorHandling = require("./customError")
const { statusCodes, errorCodes } = require("../constant/consts")


class DuplicateError extends customErrorHandling {
    constructor(message) {
        super(
            message, statusCodes.CONFLICT, errorCodes.CONFLICT
        )
    }
}

module.exports = DuplicateError