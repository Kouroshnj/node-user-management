const packageJson = require("../../package.json")
const { getUnixTimestamp } = require("../utils/getDate")

const generateMetaInformation = (errorCode) => {
    const meta = {
        service_name: packageJson.name,
        service_version: packageJson.version,
        timestamp: getUnixTimestamp(),
        errorCode
    }
    return meta
}

module.exports = generateMetaInformation