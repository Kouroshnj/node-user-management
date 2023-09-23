exports.controllerMessages = {
    User_Not_Found: "User not found",
    User_Log_Out: "User successfuly logged out",
    Update_Error: "Unable to update this field",
    Update_Success: "User successfuly updated",
    Unavailable_Image: "User image unavailable",
    Change_Password: "Password successfuly changed",
    Set_Image: "Image sets successfuly",
    Delete_Image: "Image successfuly deleted",
    Aready_Available: "Already have this value",
    PhoneNumber_Delete: "phoneNumber successfully deleted"
}

exports.environmentExp = parseInt(process.env.EXP)

exports.userModelErrors = {
    Email_Pass_Wrong: "Email or password is wrong",
    User_Not_Found: "User not found"
}

exports.authMessages = {
    User_Not_Found: "User not found",
}

exports.statusCodes = {
    OK: 200,
    Created: 201,
    Bad_Request: 400,
    Unauthorized: 401,
    Not_Found: 404,
    Not_Acceptable: 406,
    Conflict: 409
}
