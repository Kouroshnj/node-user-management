const userTokens = require("../models/userTokens")
const userModel = require("../models/users")

class Methods {
    async _updateOne(filter, key, value) {
        return await userModel.updateOne({ userId: filter, [key]: { $nin: value } }, { $set: { [key]: value } })
    }

    async _updateOnePush(filter, key, value) {
        return await userModel.updateOne(
            { userId: filter, phoneNumber: { $nin: value } },
            { $push: { [key]: value } }
        )
    }

    async _findOne(query) {
        return await userModel.findOne(query).lean()
    }

    async _findOneTokens(query) {
        return await userTokens.findOne(query)
    }

    _mongoServerError(value) {
        if (value === 11000) {
            return true
        }
        return false
    }
}

module.exports = new Methods()