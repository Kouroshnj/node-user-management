const jwt = require("jsonwebtoken")
const { tokenDetails } = require(`../../config/${process.env.NODE_ENV}`)

class AuthTokenManager {

    async generateAuthToken(user) {
        return jwt.sign({ _userId: user.userId },
            tokenDetails.jwtSecretKey,
            { expiresIn: tokenDetails.jwtExpiration })
    }

    async verifyAuthToken(token) {
        return jwt.verify(token, tokenDetails.jwtSecretKey)
    }
}

module.exports = AuthTokenManager
