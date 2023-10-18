const requestDetails = require("./requestDetails")
const { getUnixTimestamp } = require("./getDate")
const { logLevels } = require("../constant/consts")


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


module.exports = sendOKInputs