const Schemas = require("../validations/joiValidation");
const meta = require("../constant/meta")

const validate = function (schema) {
    return async function (req, res, next) {
        try {
            const { error } = await Schemas[schema].validateAsync(req.body);
            if (error) {
                const errorMessage = error.details[0].message
                return res.status(400).json({ data: errorMessage, meta })
            }
            next()
        } catch (error) {
            res.status(400).json({ data: error.message, meta })
        }
    }
}

module.exports = validate