const BaseMethods = require("./base.service")

class TokenMethods extends BaseMethods {

    constructor(model) {
        super(model)
    }

    createToken = (token, userId) => {
        const userToken = new this.model({
            token,
            userId
        })
        return userToken
    }
}

module.exports = TokenMethods