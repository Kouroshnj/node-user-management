const fs = require("fs")


const packageJson = fs.readFileSync("package.json")

const packageData = JSON.parse(packageJson)

const metaData = {
    service_name: packageData.name,
    service_version: packageData.version
}

module.exports = metaData