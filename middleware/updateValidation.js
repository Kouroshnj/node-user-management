const userModel = require("../models/users")
const methodsInstance = require("../data/methods")
const { controllerMessages } = require("../validations/messages")


const updateValidation = async function (req, res, next) {
    try {
        const updates = Object.keys(req.body)
        for (const update of updates) {
            if (update === "phoneNumber") {
                await userModel.updateOne({ userId: req.userId }, { $push: { "phoneNumber": req.body.phoneNumber } })
            } else {
                req.user[update] = req.body[update]
            }
        }
        next()
    } catch (e) {
        next(e)
    }
}

module.exports = updateValidation