const bcrypt = require("bcryptjs")

async function hashingPassword(password) {
    const salt = await bcrypt.genSalt(8)
    const hashedPass = await bcrypt.hash(password, salt)

    return hashedPass
}

module.exports = hashingPassword