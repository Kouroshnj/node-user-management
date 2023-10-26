const Schemas = require("../validations/joiValidation");
const SchemaValidationError = require("../error/schemaValidation.error")



const validation = (schema) => {
    return async function (req, res, next) {
        try {
            const values = { ...req.body, ...req.params, ...req.query }
            await Schemas[schema].validateAsync(values);
            next()
        } catch (error) {
            next(new SchemaValidationError(error.message))
        }
    }
}

module.exports = validation