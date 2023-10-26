const jwt = require("jsonwebtoken")
const { authenticate } = require(`../../config/${process.env.NODE_ENV}`)

class AuthTokenManager {

    async generateAuthToken(user) {
        return jwt.sign({ _userId: user.userId },
            authenticate.jwtSecretKey,
            { expiresIn: authenticate.jwtExpiration })
    }

    async verifyAuthToken(token) {
        return jwt.verify(token, authenticate.jwtSecretKey)
    }
}

module.exports = AuthTokenManager
