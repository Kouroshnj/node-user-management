const { environmentExp } = require("../constant/consts")
const mongoose = require("mongoose")
const { getIsoDate, getUnixTimestamp } = require("../utils/getDate")


const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
    },
    expireAt: {
        type: Date
    }
})

tokenSchema.pre("save", function (next) {
    const userToken = this
    try {
        userToken.createdAt = getUnixTimestamp()
        userToken.expireAt = getIsoDate()
        next()
    } catch (error) {
        next(error)
    }
})

const userTokens = mongoose.model("userTokens", tokenSchema)

userTokens.collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: environmentExp })

module.exports = userTokens
