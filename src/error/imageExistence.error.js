const customErrorHandling = require("./customError");
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class ImageExistence extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.UNAVAILABE_IMAGE,
            statusCodes.NOT_FOUND,
            errorCodes.NOT_FOUND,
        )
    }
}

module.exports = ImageExistence