const Schemas = require("../validations/joiValidation");

const validate = function (schema) {
    return async function (req, res, next) {
        try {
            const { error } = await Schemas[schema].validateAsync(req.body);
            if (error) {
                const errorMessage = error.details[0].message
                return res.status(400).json({ error: errorMessage })
            }
            next()
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }
}

module.exports = validate