const BaseMethods = require("./base.service")


class UserMethods extends BaseMethods {

    constructor(model) {
        super(model)
    }

    createUser(reqBody) {
        return new this.model(reqBody)
    }

}

module.exports = UserMethods