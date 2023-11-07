const packageJson = require("../../package.json")

const generateMetaInformation = (errorCode, timestamp) => {
    return {
        service_name: packageJson.name,
        service_version: packageJson.version,
        timestamp,
        errorCode
    }
}

module.exports = generateMetaInformation