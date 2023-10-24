const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageSize extends customErrorHandling {
    constructor(userId) {
        super(
            CONTROLLER_MESSAGES.IMAGE_SIZE,
            STATUSCODES.BAD_REQUEST,
            ERROR_CODES.BAD_REQUEST,
        )
        this.userId = userId
    }
}

module.exports = ImageSize