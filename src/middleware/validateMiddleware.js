const Schemas = require("../validations/joiValidation");
const factoryErrorInstance = require("../error/factory.error")


const validation = (schema) => {
    return async function (req, res, next) {
        try {
            const values = { ...req.body, ...req.params, ...req.query }
            await Schemas[schema].validateAsync(values);
            next()
        } catch (error) {
            next(factoryErrorInstance.createError("schemaValidationError", error.message))
        }
    }
}

module.exports = validation