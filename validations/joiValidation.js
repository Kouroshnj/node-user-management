const joi = require("joi")

const userValidation = joi.object({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    age: joi.number().required(),
    parent: joi.string().required().trim(),
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
    phoneNumber: joi.array().unique().items(joi.string().required().length(11).trim()),
    nationalCode: joi.string().required().length(10).trim(),
})

const LoginValidation = joi.object({
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
})

const changePasswordValidation = joi.object({
    email: joi.string().required().email().trim(),
    oldPassword: joi.string().required().min(7).trim(),
    newPassword: joi.string().required().min(7).trim()
})

const updateUserValidation = joi.object({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    age: joi.number(),
    parent: joi.string().trim(),
    email: joi.string().email().trim(),
    phoneNumber: joi.array().unique().items(joi.string().length(11).trim()),
    nationalCode: joi.string().length(10).trim(),
})

const deletePhoneNumberValidation = joi.object({
    phoneNumber: joi.array().items(joi.string().length(11).trim())
})

module.exports = {
    userValidation,
    LoginValidation,
    changePasswordValidation,
    updateUserValidation,
    deletePhoneNumberValidation
}