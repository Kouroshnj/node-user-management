const CustomErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class ImageExistence extends CustomErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.UNAVAILABE_IMAGE,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
        )
    }
}

module.exports = ImageExistence