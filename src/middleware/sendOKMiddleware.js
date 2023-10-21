const LoggerHandler = require("../utils/loggerManagement")
const generateMetaInformation = require("../constant/meta")
const { STATUSCODES, ERROR_CODES } = require("../constant/consts")

const loggerHandler = new LoggerHandler()


const sendOKMiddleware = (req, res, next) => {
    try {
        res.sendOK = function (inputLogs) {
            const { timestamp, returnValue } = inputLogs
            delete inputLogs.returnValue
            loggerHandler.storeAndDisplayLog(inputLogs)
            res.status(STATUSCODES.OK).send({ data: returnValue, meta: generateMetaInformation(ERROR_CODES.OK, timestamp) })
        }
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = sendOKMiddleware