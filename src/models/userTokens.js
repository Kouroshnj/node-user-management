const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
})

tokenSchema.statics.CreateToken = async function (token, _id) {
    const userToken = new userTokens({
        token: token,
        owner: _id
    })

    return userToken
}


const userTokens = mongoose.model("userTokens", tokenSchema)

module.exports = userTokens
