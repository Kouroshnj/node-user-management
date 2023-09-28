exports.statusCodes = {
    OK: 200,
    Created: 201,
    Bad_Request: 400,
    Unauthorized: 401,
    Not_Found: 404,
    Not_Acceptable: 406,
    Conflict: 409
}

exports.environmentExp = parseInt(process.env.EXP)

exports.controllerMessages = {
    User_Not_Found: "User not found",
    User_Log_Out: "User successfuly logged out",
    Update_Error: "Unable to update this field",
    Update_Success: "User successfuly updated",
    Unavailable_Image: "User image unavailable",
    Change_Password_Successful: "Password successfuly changed",
    Set_Image: "Image sets successfuly",
    Change_Password_Error: "Your password is wrong",
    Delete_Image: "Image successfuly deleted",
    Aready_Available: "Already have this value",
    PhoneNumber_Delete: "phoneNumber successfully deleted"
}

exports.authMessages = {
    User_Not_Found: "User not found",
    Token_Not_Exist: "Token does not exist"
}
