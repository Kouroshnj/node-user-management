const packageJson = require("../../package.json")

const meta = {
    service_name: packageJson.name,
    service_version: packageJson.version
}

module.exports = meta