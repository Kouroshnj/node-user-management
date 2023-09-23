const jwt = require("jsonwebtoken")
const { environmentExp } = require("../validations/messages")

class Management {

    _mongoServerError(value, errorValue) {
        if (value === 11000) {
            return { condition: true, error: `${Object.keys(errorValue)} which is ${Object.values(errorValue)}, is duplicate` }
        }
        return false
    }

    _generateAuthToken = async (user) => {
        const token = await jwt.sign({ _userId: user.userId },
            process.env.SECRET_KEY,
            { expiresIn: environmentExp })
        return token
    }
}

module.exports = Management