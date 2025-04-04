const requestDetails = require("./requestDetails")
const { getUnixTimestamp } = require("./getDate")
const { LOG_LEVELS, STATUSCODES, ERROR_CODES } = require("../constant/consts")

const setSendOKInputs = (request) => {
    return {
        level: LOG_LEVELS.successful,
        userIP: request.ip,
        inputValues: requestDetails(request),
        path: request.path,
        loggerType: "Success",
        codes: {
            statusCode: STATUSCODES.OK,
            errorCode: ERROR_CODES.OK
        },
        method: request.method,
        timestamp: getUnixTimestamp()
    }
}

const setErrorLogInputs = (userID, error, request) => {
    return {
        level: LOG_LEVELS.error,
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
    setSendOKInputs,
    setErrorLogInputs
}