const CustomErrorHandling = require("./customError");
const { AUTH_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class TokenExistenceError extends CustomErrorHandling {
    constructor() {
        super(
            AUTH_MESSAGES.TOKEN_NOT_EXIST,
            STATUSCODES.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED
        )
    }
}

module.exports = TokenExistenceError