const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageFormatError extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.FORMAT_ERROR,
            STATUSCODES.UNSUPPORTED_MEDIA_TYPE,
            ERROR_CODES.UNSUPPORTED_MEDIA_TYPE
        )
    }
}

module.exports = ImageFormatError