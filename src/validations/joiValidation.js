const joi = require("joi")

const userValidation = joi.object({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    age: joi.number().strict(),
    parent: joi.string().trim(),
    email: joi.string().email().trim(),
    password: joi.string().min(7).trim(),
    phoneNumber: joi.array().items(joi.string().length(11).trim()),
    nationalCode: joi.string().length(10).trim(),
})

const LoginValidation = joi.object({
    email: joi.string().required().email().trim(),
    password: joi.string().required().min(7).trim(),
})

const changePasswordValidation = joi.object({
    oldPassword: joi.string().required().min(7).trim(),
    newPassword: joi.string().required().min(7).trim()
})

const updateUserValidation = joi.object({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    age: joi.number().strict(),
    parent: joi.string().trim(),
    email: joi.string().email().trim(),
    phoneNumber: joi.array().items(joi.string().length(11).trim()),
    nationalCode: joi.string().length(10).trim(),
})

const deletePhoneNumberValidation = joi.object({
    phoneNumber: joi.array().items(joi.string().length(11).trim())
})

const imageParamValidation = joi.object({
    fileName: joi.string().required()
})

module.exports = {
    userValidation,
    LoginValidation,
    changePasswordValidation,
    updateUserValidation,
    deletePhoneNumberValidation,
    imageParamValidation
}