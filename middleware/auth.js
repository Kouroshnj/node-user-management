const jwt = require("jsonwebtoken");
const methodsInstance = require("../data/methods")
const { authMessages } = require("../validations/messages")



const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verificationStatus = await jwt.verify(token, process.env.SECRET_KEY)
        const query = { userId: verificationStatus._userId }
        const query2 = { owner: verificationStatus._userId }
        const [userInfo, userToken] = await Promise.all([
            methodsInstance._findOne(query),
            methodsInstance._findOneTokens(query2)
        ])
        if (!userToken || userToken == null) {
            return res.status(404).send({ message: authMessages.User_Not_Found })
        }

        if (!userInfo) {
            return res.status(404).send({ message: authMessages.User_Not_Found })
        }
        req.token = token
        req.userId = verificationStatus._userId
        req.user = userInfo
        next()
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
}

module.exports = auth