const joi = require("joi")

const userValidation = joi.object({
    firstName: joi.string().optional().trim(),
    lastName: joi.string().optional().trim(),
    age: joi.number().optional().strict(),
    parent: joi.string().optional().trim(),
    email: joi.string().email().trim(),
    password: joi.string().required().min(7).trim(),
    phoneNumber: joi.array().items(joi.string().length(11).trim()),
    nationalCode: joi.string().length(10).trim(),
}).or("email", "nationalCode", "phoneNumber").required()

const LoginValidation = joi.object({
    email: joi.string().email().trim(),
    phoneNumber: joi.string().length(11).trim(),
    nationalCode: joi.string().length(10).trim(),
    password: joi.string().required().min(7).trim(),
}).or("email", "phoneNumber", "nationalCode").required()

const changePasswordValidation = joi.object({
    oldPassword: joi.string().required().min(7).trim(),
    newPassword: joi.string().required().min(7).trim()
})

const updateUserValidation = joi.object({
    firstName: joi.string().trim().optional(),
    lastName: joi.string().trim().optional(),
    age: joi.number().strict().optional(),
    parent: joi.string().trim().optional(),
    email: joi.string().email().trim().optional(),
    phoneNumber: joi.array().items(joi.string().length(11).trim()).optional(),
    nationalCode: joi.string().length(10).trim().optional(),
})

module.exports = {
    userValidation,
    LoginValidation,
    changePasswordValidation,
    updateUserValidation
}