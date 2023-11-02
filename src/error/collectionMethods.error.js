const CustomErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class MongoDBOperationErrorHandler extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
        )
    }
}

module.exports = MongoDBOperationErrorHandler