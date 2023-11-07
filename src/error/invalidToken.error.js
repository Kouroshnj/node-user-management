const CustomErrorHandling = require("./customError");
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class InvalidTokenError extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED
        )
    }
}

module.exports = InvalidTokenError