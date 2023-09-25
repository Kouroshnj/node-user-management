const bcrypt = require("bcryptjs")
const { userModelErrors } = require("../validations/messages")


class Methods {

    constructor(model) {
        this.model = model
    }

    async _updateOne(query, operation) {
        return await this.model.updateOne(query, operation)
    }

    async _findOne(query) {
        return await this.model.findOne(query).lean()
    }

    async _deleteOne(query) {
        return await this.model.deleteOne(query)
    }

    async _findOneAndUpdate(query, operation) {
        return this.model.findOneAndUpdate(query, operation)
    }

    _findByInfo = async (query, password) => {
        const user = await this._findOne(query, this.model)

        if (!user) {
            throw new Error(userModelErrors.User_Not_Found)
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new Error(userModelErrors.Email_Pass_Wrong)
        }

        return user
    }

    _createUser = async (reqBody) => {
        const user = new this.model(reqBody)
        return user
    }

    _createToken = (token, userId) => {
        const userToken = new this.model({
            token,
            userId
        })
        return userToken
    }


}

module.exports = Methods