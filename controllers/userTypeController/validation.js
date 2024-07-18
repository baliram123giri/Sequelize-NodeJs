const Joi = require("joi");

const createUserTypeValidation = Joi.object({
    name: Joi.string().required(),
})
const updateUserTypeValidation = Joi.object({
    name: Joi.string().optional(),
})

module.exports = { createUserTypeValidation, updateUserTypeValidation }