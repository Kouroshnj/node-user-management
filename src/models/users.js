const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const { hashingPassword } = require("../utils/hashAndComparePass")


const userSchema = new mongoose.Schema({
    userId: String,

    firstName: String,

    lastName: String,

    age: String,

    parent: String,

    email: String,

    password: String,

    phoneNumber: [{
        String
    }],

    nationalCode: String,

    avatars: [{
        String
    }]
})

userSchema.pre("save", async function (next) {
    const user = this
    try {
        if (!user.isModified("password")) {
            return next()
        }
        user.userId = uuidv4()
        user.password = await hashingPassword(user.password)
        next()
    } catch (error) {
        next(error)
    }
})

const userModel = mongoose.model("userModel", userSchema);

userModel.collection.createIndex({ phoneNumber: 1 }, { partialFilterExpression: { "phoneNumber.0": { $exists: true } }, unique: true })

userModel.collection.createIndex({ email: 1 }, { partialFilterExpression: { email: { $exists: true } }, unique: true })

userModel.collection.createIndex({ nationalCode: 1 }, { partialFilterExpression: { nationalCode: { $exists: true } }, unique: true })


module.exports = userModel