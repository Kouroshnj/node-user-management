const customErrorHandling = require("./customError");
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class CollectionMethodsError extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.MONGO_METHOD_ERROR,
            statusCodes.INTERNAL_SERVER_ERROR,
            errorCodes.INTERNAL_SERVER_ERROR,
        )
    }
}

module.exports = CollectionMethodsError