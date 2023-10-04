const { controllerMessages } = require("../constant/consts")

const bcrypt = require("bcryptjs")

async function hashingPassword(password) {
    const salt = await bcrypt.genSalt(8)
    const hashedPass = await bcrypt.hash(password, salt)

    return hashedPass
}

async function comparePass(oldPassword, oldHashedPassword) {
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword)

    if (!isValid) {
        throw new Error(controllerMessages.EMAIL_PASS_WRONG)
    }
}

module.exports = {
    hashingPassword,
    comparePass
}