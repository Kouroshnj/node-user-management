const customErrorHandling = require("./customError");
const { authMessages, statusCodes, errorCodes } = require("../constant/consts")


class TokenExistenceError extends customErrorHandling {
    constructor() {
        super(
            authMessages.TOKEN_NOT_EXIST,
            statusCodes.UNAUTHORIZED,
            errorCodes.UNAUTHORIZED
        )
    }
}

module.exports = TokenExistenceError