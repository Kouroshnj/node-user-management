const LoggerHandler = require("../utils/loggerManagement")
const generateMetaInformation = require("../constant/meta")
const { statusCodes, errorCodes } = require("../constant/consts")

const loggerHandler = new LoggerHandler()


const sendOKMiddleware = (req, res, next) => {
    try {
        res.sendOK = function (options) {
            const { timestamp, returnValue } = options
            delete options.returnValue
            loggerHandler.storeAndDisplayLog(options)
            res.status(statusCodes.OK).send({ data: returnValue, meta: generateMetaInformation(errorCodes.OK, timestamp) })
        }
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = sendOKMiddleware