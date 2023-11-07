const { loggerConfig } = require(`../../config/${process.env.NODE_ENV}`)
const LoggerService = require("../services/logger.service")
const loggerModel = require("../models/logger")


const loggerServiceInstance = new LoggerService(loggerModel)

class LoggerHandler {

    storeLogInDB = async (inputLogs) => {
        if (loggerConfig.storeLogInMongo) {
            loggerServiceInstance.createDocument(inputLogs)
        }
    }

    showLogInTerminal = async (inputLogs) => {
        if (loggerConfig.showLogInTerminal) {
            console.log(this.#terminalLogInputs(inputLogs))
        }
    }

    #terminalLogInputs = (inputLogs) => {
        return {
            ...inputLogs,
            inputValues: JSON.stringify(inputLogs.inputValues),
        }

    }

}

module.exports = LoggerHandler
