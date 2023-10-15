const { loggerConfig } = require(`../../config/${process.env.NODE_ENV}`)
const LoggerService = require("../services/logger.service")
const loggerModel = require("../models/logger")


const loggerServiceInstance = new LoggerService(loggerModel)

class LoggerHandler {
    storeAndDisplayLog = async (options) => {
        try {
            if (loggerConfig.storeLogInMongo) {
                loggerServiceInstance.createDocument(options)
            }
            if (loggerConfig.showLogInTerminal) {
                console.log(this.#terminalLogInputs(options))
            }
        } catch (error) {
            console.log("logger Failed in storeAndDisplayLog", error)
        }
    }

    #terminalLogInputs = (options) => {
        return {
            ...options,
            inputValues: JSON.stringify(options.inputValues),
        }

    }

}

module.exports = LoggerHandler
