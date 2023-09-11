const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tokens = require("./userTokens")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            return isNaN(value)
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            return isNaN(value)
        }
    },
    age: {
        type: Number,
        default: 18
    },
    parent: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            return isNaN(value)
        }
    },
    email: {
        type: String,
        rquired: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Invalid password")
            }
        }
    },
    phoneNumber: [{
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (value.length !== 11) {
                throw new Error("Invalid phone number")
            }
        }
    }],
    nationalCode: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (value.length !== 10) {
                throw new Error("Invalid national code")
            }
        }
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
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error("User not found")
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new Error("Username or password is wrong")
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "thisismynodeproject")
    return token
}

userSchema.pre("save", async function (next) {
    const user = this
    try {
        if (!user.isModified("password")) {
            return next()
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