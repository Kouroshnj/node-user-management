const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageFormatError extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.FORMAT_ERROR,
            STATUSCODES.NOT_ACCESPTABLE,
            ERROR_CODES.NOT_ACCESPTABLE
        )
    }
}

module.exports = ImageFormatError