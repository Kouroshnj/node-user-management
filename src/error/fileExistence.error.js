const CustomErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class FileExistence extends CustomErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.CHECK_USER_FILE_EXISTENCE,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
        )
    }
}

module.exports = FileExistence