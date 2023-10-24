const customErrorHandling = require("./customError");
const { CONTROLLER_MESSAGES, STATUSCODES, ERROR_CODES } = require("../constant/consts")


class CollectionMethodsError extends customErrorHandling {
    constructor() {
        super(
            CONTROLLER_MESSAGES.MONGO_METHOD_ERROR,
            STATUSCODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
        )
    }
}

module.exports = CollectionMethodsError