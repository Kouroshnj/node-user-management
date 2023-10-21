const requestDetails = require("./requestDetails")
const { getUnixTimestamp } = require("./getDate")
const { logLevels, statusCodes, errorCodes } = require("../constant/consts")

const sendOKInputs = (request) => {
    return {
        level: logLevels.successful,
        userIP: request.ip,
        inputValues: requestDetails(request),
        path: request.path,
        loggerType: "Success",
        codes: {
            statusCode: statusCodes.OK,
            errorCode: errorCodes.OK
        },
        method: request.method,
        timestamp: getUnixTimestamp()
    }
}

const setErrorLogInputs = (userID, error, request) => {
    return {
        level: logLevels.error,
        inputValues: requestDetails(request),
        message: error.message,
        userID,
        userIP: request.ip,
        path: request.path,
        loggerType: "Error",
        codes: {
            statusCode: error.statusCode,
            errorCode: error.errorCode
        },
        method: request.method,
        timestamp: getUnixTimestamp()
    }
}


module.exports = {
    sendOKInputs,
    setErrorLogInputs
}