const jwt = require("jsonwebtoken");
const User = require("../src/models/users")
const Tokens = require("../src/models/userTokens")


const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verification = jwt.verify(token, "thisismynodeproject")
        const user = await User.findOne({ _id: verification._id })
        const userToken = await Tokens.findOne({ owner: user._id })

        if (!userToken) {
            res.status(404).send("Unable to find user")
        }

        if (!user) {
            res.status(404).send("User not found")
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(404).send({ error: e })
    }
}

module.exports = auth