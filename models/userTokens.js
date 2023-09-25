const { environmentExp } = require("../validations/messages")
const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: "userModel"
    },
    createdAt: {
        type: Date,
        expires: environmentExp,
        default: Date.now
    }
})

const userTokens = mongoose.model("userTokens", tokenSchema)

module.exports = userTokens
