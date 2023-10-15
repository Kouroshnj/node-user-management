const { logLevels } = require("../constant/consts")
const generateMetaInformation = require("../constant/meta")
const { getUnixTimestamp } = require("../utils/getDate")
const LoggerHandler = require("../utils/loggerManagement")
const requestDetails = require("../utils/requestDetails")

const loggerHandler = new LoggerHandler()

const errorHandling = async (error, req, res, next) => {
    const statusCode = error.statusCode || 500
    const errorCode = error.errorCode || "INTERNAL_SEVER_ERROR"
    const userID = error.userId || undefined

    loggerHandler.storeAndDisplayLog(setErrorLogInputs(userID, error, req))

    return res.status(statusCode).send({
        data: error.message,
        meta: generateMetaInformation(errorCode)
    })
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
        method: request.method,
        timestamp: getUnixTimestamp()
    }
}

module.exports = errorHandling