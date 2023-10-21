const customErrorHandling = require("./customError");
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageUploadSizeError extends customErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND
        )
    }
}

module.exports = ImageUploadSizeError