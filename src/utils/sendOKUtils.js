const requestDetails = require("./requestDetails")
const LoggerHandler = require("../utils/loggerManagement")
const { getUnixTimestamp } = require("./getDate")
const { logLevels } = require("../constant/consts")

const loggerHandler = new LoggerHandler()


const sendOKInputs = (request) => {
    return {
        level: logLevels.successful,
        userIP: request.ip,
        inputValues: requestDetails(request),
        path: request.path,
        loggerType: "Success",
        method: request.method,
        timestamp: getUnixTimestamp()
    }
}

const sendOKLogDisplay = async (options) => {
    const { returnValue } = options
    delete options.returnValue
    await loggerHandler.storeAndDisplayLog(options)
    return returnValue
}


module.exports = {
    sendOKInputs,
    sendOKLogDisplay
}