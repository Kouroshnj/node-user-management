const CustomErrorHandling = require("./customError");
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")


class SchemaValidationError extends CustomErrorHandling {
    constructor(message) {
        super(
            message,
            STATUSCODES.NOT_ACCEPTABLE,
            ERROR_CODES.NOT_ACCEPTABLE
        )
    }
}

module.exports = SchemaValidationError