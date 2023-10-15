const customErrorHandling = require("./customError")
const { controllerMessages, statusCodes, errorCodes } = require("../constant/consts")


class EmailOrPasswordWrong extends customErrorHandling {
    constructor() {
        super(
            controllerMessages.EMAIL_PASS_WRONG,
            statusCodes.UNAUTHORIZED,
            errorCodes.CREDENTIALS,
        )
    }
}
module.exports = EmailOrPasswordWrong