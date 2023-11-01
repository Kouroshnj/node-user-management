exports.STATUSCODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
}

exports.CONTROLLER_MESSAGES = {
    SIGNUP_SUCCESSFUL: "User successfully signed up",
    LOGIN_SUCCESSFUL: "User successfully logged in",
    USER_LOG_OUT_SUCCESSFUL: "User successfully logged out",
    USER_LOG_OUT_ERROR: "User log out process unsuccessful",
    UPDATE_SUCCESS: "User successfully updated",
    UNAVAILABE_IMAGE: "User image unavailable",
    GET_PROFILE_SUCCESSFUL: "User got the profile successfully",
    CHANGE_PASSWORD_SUCCESSFUL: "Password successfully changed",
    SET_IMAGE_ERROR: "Set image process failed",
    SET_IMAGE_SUCCESSFUL: "Image sets successfully",
    INVALID_CREDENTIALS: "Invalid credentials",
    DELETE_IMAGE_SUCCESSFUL: "Image successfully deleted",
    DELETE_IMAGE_ERROR: "Image deleting unsuccessful",
    PHONENUMBER_DELETE_SUCCESSFUL: "PhoneNumber successfully deleted",
    SEND_FILE_ERROR: "Sending file error!",
    IMAGE_SIZE: "File is too large",
    FORMAT_ERROR: "Format must be jpg or png",
    TOO_MANY_REQUESTS: "Too many attempts, please try again later"
}

exports.ERROR_CODES = {
    OK: "OK",
    UNAUTHORIZED: "UNAUTHORIZED",
    NOT_FOUND: "NOT_FOUND",
    NOT_ACCEPTABLE: "NOT_ACCEPTABLE",
    UNPROCESSABLE: "UNPROCESSABLE",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
    CONFLICT: "CONFLICT",
    NO_CONTENT: "NO_CONTENT",
    CREDENTIALS: "INVALID_CREDENTIALS",
    TOO_MANY_REQUESTS: "TOO MANY REQUESTS",
    PAYLOAD_TOO_LARGE: "PAYLOAD",
    UNSUPPORTED_MEDIA_TYPE: "MEDIA_TYPE"
}

exports.AUTH_MESSAGES = {
    TOKEN_NOT_EXIST: "Token does not exist"
}

exports.LOG_LEVELS = {
    error: "Error",
    warn: "Warning",
    info: "Information",
    http: "HTTP",
    debug: "Debug",
    successful: "Successful"
}
