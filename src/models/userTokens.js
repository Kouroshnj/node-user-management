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
    const userToken = new Tokens({
        token: token,
        owner: _id
    })

    return userToken
}


const Tokens = mongoose.model("Tokens", tokenSchema)

module.exports = Tokens
