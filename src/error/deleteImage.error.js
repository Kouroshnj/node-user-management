const customErrorHandling = require("./customError");
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class DeleteImageError extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.DELETE_IMAGE_ERROR,
            statusCodes.INTERNAL_SERVER_ERROR,
            errorCodes.INTERNAL_SERVER_ERROR
        )
    }
}

module.exports = DeleteImageError