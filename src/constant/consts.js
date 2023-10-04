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
    INTERNAL_SERVER_ERROR: 500
}

exports.controllerMessages = {
    USER_LOG_OUT_SUCCESSFUL: "User successfuly logged out",
    UPDATE_SUCCESS: "User successfuly updated",
    UNAVAILABE_IMAGE: "User image unavailable",
    CHANGE_PASSWORD_SUCCESSFUL: "Password successfuly changed",
    SET_IMAGE_SUCCESSFUL: "Image sets successfuly",
    EMAIL_PASS_WRONG: "Email or password is wrong",
    DELETE_IMAGE_SUCCESSFUL: "Image successfuly deleted",
    DELETE_IMAGE_ERROR: "image deleting unsuccessful",
    PHONENUMBER_DELETE_SUCCESSFUL: "phoneNumber successfully deleted"
}

exports.authMessages = {
    TOKEN_NOT_EXIST: "Token does not exist"
}
