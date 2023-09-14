const { controllerMessages } = require("../validations/errorMessage")

const updateValidation = async function (req, res, next) {
    const updates = Object.keys(req.body)
    const validFields = ["firstName", "lastName", "parent", "email", "phoneNumber", "nationalCode"]
    const isValid = updates.every((update) => {
        return validFields.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({ message: controllerMessages.Update_Error })
    }

    try {
        const userPhoneNumbers = await req.user.phoneNumber
        updates.forEach((update) => {
            if (update === "phoneNumber") {
                userPhoneNumbers.push(req.body.phoneNumber)
            } else {
                req.user[update] = req.body[update]
            }
        })
        next()
    } catch (e) {
        next(e.message)
    }
}

module.exports = updateValidation