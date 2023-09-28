const { environmentExp } = require("../constant/consts")
const mongoose = require("mongoose")

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
        default: Date.now()
    }
})

const userTokens = mongoose.model("userTokens", tokenSchema)

userTokens.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: environmentExp })

module.exports = userTokens
