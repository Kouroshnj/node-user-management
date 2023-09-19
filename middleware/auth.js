const jwt = require("jsonwebtoken");
const methodsInstance = require("../data/methods")
const { authMessages } = require("../validations/errorMessage")



const auth = async function (req, res, next) {
    try {
        const token = await req.header("Authorization").replace("Bearer ", "");
        const verification = jwt.verify(token, process.env.SECRET_KEY)
        const query = { _id: verification._id }
        const user = methodsInstance._findOne(query)
        const query2 = { owner: verification._id }
        const userToken = methodsInstance._findOneTokens(query2)
        const st = await Promise.all([verification, user, userToken])

        if (!userToken) {
            return res.status(404).send(authMessages.User_Not_Found)
        }

        if (!user) {
            return res.status(404).send(authMessages.User_Not_Found)
        }
        req.token = token
        req.userId = st[1].userId
        req.token_id = st[0]._id
        req.user = st[1]
        next()
    } catch (e) {
        res.status(404).send({ error: e.message })
    }
}

module.exports = auth