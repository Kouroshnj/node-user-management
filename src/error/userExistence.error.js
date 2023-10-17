const customErrorHandling = require("./customError")
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class InvalidCredentials extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.INVALID_CREDENTIALS,
            statusCodes.UNAUTHORIZED,
            errorCodes.CREDENTIALS,
        )
    }
}
module.exports = InvalidCredentials