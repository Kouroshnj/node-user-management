const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class CollectionMethodsError extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.MONGO_METHOD_ERROR,
            STATUSCODES.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
        )
    }
}

module.exports = CollectionMethodsError