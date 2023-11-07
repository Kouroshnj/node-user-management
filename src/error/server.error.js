const CustomErrorHandling = require("./customError");
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ServerError extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
        )
    }
}

module.exports = ServerError