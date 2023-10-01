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
    },
    expireAt: {
        type: Date
    }
})

const userTokens = mongoose.model("userTokens", tokenSchema)

userTokens.collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: environmentExp })

module.exports = userTokens
