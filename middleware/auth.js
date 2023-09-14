const jwt = require("jsonwebtoken");
const userModel = require("../models/users")
const userTokens = require("../models/userTokens")
const { authMessages } = require("../validations/errorMessage")
require("dotenv").config()



const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verification = jwt.verify(token, process.env.SECRET_KEY)
        const user = await userModel.findOne({ _id: verification._id })
        const userToken = await userTokens.findOne({ owner: user._id })

        if (!userToken) {
            res.status(404).send(authMessages.User_Not_Found)
        }

        if (!user) {
            res.status(404).send(authMessages.User_Not_Found)
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
}

module.exports = auth