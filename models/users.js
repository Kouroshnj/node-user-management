const mongoose = require("mongoose")
require("dotenv").config()
const { userModelErrors } = require("../validations/errorMessage")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
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

    return userObject
}

userSchema.statics.findUserByInfo = async function (email, password) {
    const user = await userModel.findOne({ email: email })

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
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch (e) {
        next(e)
    }
})



const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel