const jwt = require("jsonwebtoken")
const { environmentExp } = require("../constant/consts")

class AuthManagement {

    generateAuthToken = async (user) => {
        return await jwt.sign({ _userId: user.userId },
            process.env.SECRET_KEY,
            { expiresIn: environmentExp })
    }

    verifyAuthToken = async (token) => {
        return await jwt.verify(token, process.env.SECRET_KEY)
    }
}

module.exports = AuthManagement