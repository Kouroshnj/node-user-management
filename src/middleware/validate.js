const Schemas = require("../validations/joiValidation");
const meta = require("../constant/meta")
const { statusCodes } = require("../constant/consts")

const validate = function (schema) {
    return async function (req, res, next) {
        try {
            const { error } = await Schemas[schema].validateAsync(req.body);
            if (error) {
                const errorMessage = error.details[0].message
                return res.status(statusCodes.BAD_REQUEST).json({ data: errorMessage, meta })
            }
            next()
        } catch (error) {
            res.status(statusCodes.BAD_REQUEST).json({ data: error.message, meta })
        }
    }
}

module.exports = validate