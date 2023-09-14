const joi = require("joi")

const userValidation = joi.object({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    age: joi.number().default(18),
    parent: joi.string().required().trim(),
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
    phoneNumber: joi.string().required().length(11).trim(),
    nationalCode: joi.string().required().length(10).trim(),
    avatar: joi.string()
})

const LoginValidation = joi.object({
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
})

const changePasswordValidation = joi.object({
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
    newPassword: joi.string().required().min(7).trim()
})

const updateUserValidation = joi.object({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    age: joi.number().default(18),
    parent: joi.string().trim(),
    email: joi.string().email().trim(),
    phoneNumber: joi.string().length(11).trim(),
    nationalCode: joi.string().length(10).trim(),
    avatar: joi.string()
})

module.exports = {
    userValidation,
    LoginValidation,
    changePasswordValidation,
    updateUserValidation
}