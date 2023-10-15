const customErrorHandling = require("./customError");
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class ImageUploadSizeError extends customErrorHandling {
    constructor(message) {
        super(
            message,
            statusCodes.NOT_FOUND,
            errorCodes.NOT_FOUND
        )
    }
}

module.exports = ImageUploadSizeError