exports.statusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NOT_ACCESPTABLE: 406,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
}

exports.controllerMessages = {
    SIGNUP_SUCCESSFUL: "User successfuly signed up",
    LOGIN_SUCCESSFUL: "User successfuly logged in",
    USER_LOG_OUT_SUCCESSFUL: "User successfuly logged out",
    UPDATE_SUCCESS: "User successfuly updated",
    UNAVAILABE_IMAGE: "User image unavailable",
    GET_PROFILE_SUCCESSFUL: "User got the profile successfuly",
    CHANGE_PASSWORD_SUCCESSFUL: "Password successfuly changed",
    SET_IMAGE_SUCCESSFUL: "Image sets successfuly",
    INVALID_CREDENTIALS: "Invalid credentials",
    DELETE_IMAGE_SUCCESSFUL: "Image successfuly deleted",
    DELETE_IMAGE_ERROR: "image deleting unsuccessful",
    PHONENUMBER_DELETE_SUCCESSFUL: "phoneNumber successfully deleted",
    SEND_FILE_ERROR: "sending file error!",
    FORMAT_ERROR: "format must be jpg or png",
    URL_PARAMS: "Url param didn't provided!",
    MONGO_METHOD_ERROR: "method process failed",
    TOO_MANY_REQUESTS: "Too many attemps, please try again later"
}

exports.errorCodes = {
    OK: "OK",
    UNAUTHORIZED: "UNAUTHORIZED",
    NOT_FOUND: "NOT_FOUND",
    NOT_ACCESPTABLE: "NOT_ACCESPTABLE",
    UNPROCESSABLE: "UNPROCESSABLE",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
    CONFLICT: "COFLICT",
    NO_CONTENT: "NO_CONTENT",
    CREDENTIALS: "INVALID_CREDENTIALS",
    TOO_MANY_REQUESTS: "TOO MANY REQUESTS"
}

exports.authMessages = {
    TOKEN_NOT_EXIST: "Token does not exist"
}

exports.logLevels = {
    error: "Error",
    warn: "Warning",
    info: "Information",
    http: "HTTP",
    debug: "Debug",
    successful: "Successful"
}
