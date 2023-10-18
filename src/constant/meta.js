const packageJson = require("../../package.json")

const generateMetaInformation = (errorCode, timestamp) => {
    const meta = {
        service_name: packageJson.name,
        service_version: packageJson.version,
        timestamp,
        errorCode
    }
    return meta
}

module.exports = generateMetaInformation