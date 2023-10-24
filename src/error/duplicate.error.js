const CustomErrorHandling = require("./customError")
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class DuplicateError extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.CONFLICT,
            ERROR_CODES.CONFLICT
        )
    }
}

module.exports = DuplicateError