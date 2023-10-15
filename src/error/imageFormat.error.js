const customErrorHandling = require("./customError");
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class ImageFormatError extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.FORMAT_ERROR,
            statusCodes.NOT_ACCESPTABLE,
            errorCodes.NOT_ACCESPTABLE
        )
    }
}

module.exports = ImageFormatError