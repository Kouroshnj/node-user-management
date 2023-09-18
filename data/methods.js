const userModel = require("../models/users");

class Methods {
    async _updateOne(filter, key, value) {
        return await userModel.updateOne({ userId: filter }, { $set: { [key]: value } })
    }

    async _updateOnePush(filter, key, value) {
        return await userModel.updateOne(
            { userId: filter}
            , { $push: { [key]: value } })
    }
}

module.exports = new Methods()