const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageSize extends customErrorHandling {
    constructor(userId) {
        super(
            CONTROLLER_MESSAGES.IMAGE_SIZE,
            STATUSCODES.PAYLOAD_TOO_LARGE,
            ERROR_CODES.PAYLOAD_TOO_LARGE,
        )
        this.userId = userId
    }
}

module.exports = ImageSize