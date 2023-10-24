const CustomErrorHandling = require("./customError");
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class SchemaValidationError extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.NOT_ACCESPTABLE,
            ERROR_CODES.NOT_ACCESPTABLE
        )
    }
}

module.exports = SchemaValidationError