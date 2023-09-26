const { environmentExp } = require("../constant/consts")
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

module.exports = mongoose.model("userTokens", tokenSchema)
