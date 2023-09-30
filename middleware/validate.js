const Schemas = require("../validations/joiValidation");
const metaData = require("../constant/metaData")

const validate = function (schema) {
    return async function (req, res, next) {
        try {
            const { error } = await Schemas[schema].validateAsync(req.body);
            if (error) {
                const errorMessage = error.details[0].message
                return res.status(400).json({ message: errorMessage, metaData })
            }
            next()
        } catch (error) {
            res.status(400).json({ message: error.message, metaData })
        }
    }
}

module.exports = validate