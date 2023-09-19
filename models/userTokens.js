const { environmentExp } = require("../validations/messages")
const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        expires: environmentExp,
        default: Date.now
    }
})

tokenSchema.statics.CreateToken = async function (token, userId) {
    const userToken = new userTokens({
        token: token,
        owner: userId
    })

    return userToken
}


const userTokens = mongoose.model("userTokens", tokenSchema)

module.exports = userTokens
