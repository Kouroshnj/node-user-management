const customErrorHandling = require("./customError");
const { statusCodes, errorCodes } = require("../constant/consts")


class SchemaValidationError extends customErrorHandling {
    constructor(message) {
        super(
            message,
            statusCodes.NOT_ACCESPTABLE,
            errorCodes.NOT_ACCESPTABLE
        )
    }
}

module.exports = SchemaValidationError