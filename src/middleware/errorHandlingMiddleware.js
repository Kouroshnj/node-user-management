
const generateMetaInformation = require("../constant/meta")
const { setErrorLogInputs } = require("../utils/loggerInputs")
const LoggerHandler = require("../utils/loggerManagement")

const loggerHandler = new LoggerHandler()

const errorHandlingMiddleware = async (error, req, res, next) => {
    const statusCode = error.statusCode || 500
    const errorCode = error.errorCode || "INTERNAL_SEVER_ERROR"
    const userID = error.userId || undefined
    const errorLogInputs = setErrorLogInputs(userID, error, req)

    loggerHandler.storeLogInDB(errorLogInputs)
    loggerHandler.showLogInTerminal(errorLogInputs)

    return res.status(statusCode).send({
        data: error.message,
        meta: generateMetaInformation(errorCode, errorLogInputs.timestamp)
    })
}


module.exports = errorHandlingMiddleware