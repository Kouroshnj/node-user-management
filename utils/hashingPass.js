const bcrypt = require("bcryptjs")

class HashingPass {

    async hashingPassword(password) {
        const salt = await bcrypt.genSalt(8)
        const hashedPass = await bcrypt.hash(password, salt)

        return hashedPass
    }
}

module.exports = HashingPass