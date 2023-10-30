const factoryErrorInstance = require("../error/factory.error")
const bcrypt = require("bcryptjs")

async function hashingPassword(password) {
    const salt = await bcrypt.genSalt(8)
    const hashedPass = await bcrypt.hash(password, salt)

    return hashedPass
}

async function comparePass(oldPassword, oldHashedPassword) {
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword)

    if (!isValid) {
        throw factoryErrorInstance.createError("userExistence")
    }
}

module.exports = {
    hashingPassword,
    comparePass
}