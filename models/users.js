const mongoose = require("mongoose")
const { userModelErrors } = require("../validations/errorMessage")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    parent: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: [{
        type: String
    }],
    nationalCode: {
        type: String
    },
    avatar: {
        type: String
    }
})

userSchema.virtual("Tokens", {
    ref: "Tokens",
    localField: "_id",
    foreignField: "owner"
})

// <<<<<<<<<<<< methods >>>>>>>>>>>>
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.email
    delete userObject.nationalCode
    delete userObject.phoneNumber
    delete userObject.userId

    return userObject
}

userSchema.statics.findUserByInfo = async function (email, password) {
    const query = { email }
    const user = await userModel.findOne(query)

    if (!user) {
        throw new Error("User not found")
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new Error("Username or password is wrong")
    }

    return user
}

userSchema.methods.generateAuthToken = function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

    return token
}

userSchema.pre("save", async function (next) {
    const user = this
    try {
        if (!user.isModified("password")) {
            return next()
        }
        if (user.password.toLowerCase().includes("password")) {
            throw new Error(userModelErrors.Invalid_Pass)
        }
        user.userId = `UserId,${uuidv4()}`
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch (e) {
        next(e)
    }
})

const userModel = mongoose.model("userModel", userSchema);

userModel.collection.createIndex({ age: 1 })

userModel.collection.createIndex({ phoneNumber: 1 }, { unique: true })

userModel.collection.createIndex({ email: 1 }, { unique: true })

userModel.collection.createIndex({ nationalCode: 1 }, { unique: true })

module.exports = userModel