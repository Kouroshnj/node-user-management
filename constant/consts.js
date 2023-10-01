exports.statusCodes = {
    OK: 200,
    Created: 201,
    Bad_Request: 400,
    Unauthorized: 401,
    Not_Found: 404,
    Not_Acceptable: 406,
    Conflict: 409,
    Unprocessable: 422,
    Inrernal_Server_Error: 500
}

exports.environmentExp = parseInt(process.env.EXP)

exports.controllerMessages = {
    User_Log_Out: "User successfuly logged out",
    Update_Success: "User successfuly updated",
    Unavailable_Image: "User image unavailable",
    Change_Password_Successful: "Password successfuly changed",
    Set_Image: "Image sets successfuly",
    Email_Pass_Wrong: "Email or password is wrong",
    Delete_Image: "Image successfuly deleted",
    PhoneNumber_Delete: "phoneNumber successfully deleted"
}

exports.authMessages = {
    Token_Not_Exist: "Token does not exist"
}
