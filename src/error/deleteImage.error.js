const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class DeleteImageError extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.DELETE_IMAGE_ERROR,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND
        )
    }
}

module.exports = DeleteImageError