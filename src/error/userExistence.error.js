const customErrorHandling = require("./customError")
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class InvalidCredentials extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.INVALID_CREDENTIALS,
            STATUSCODES.UNAUTHORIZED,
            ERROR_CODES.CREDENTIALS,
        )
    }
}
module.exports = InvalidCredentials