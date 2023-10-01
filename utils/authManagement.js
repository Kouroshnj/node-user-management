const jwt = require("jsonwebtoken")
const { environmentExp } = require("../constant/consts")

class AuthManagement {

    async generateAuthToken(user) {
        return jwt.sign({ _userId: user.userId },
            process.env.SECRET_KEY,
            { expiresIn: environmentExp })
    }

    async verifyAuthToken(token) {
        return jwt.verify(token, process.env.SECRET_KEY)
    }
}

module.exports = AuthManagement