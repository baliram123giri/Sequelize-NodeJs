const Joi = require("joi");

const createWebsiteValidation = Joi.object({
    name: Joi.string().required(),
    is_active: Joi.boolean().optional(),
})
const updateWebsiteValidation = Joi.object({
    name: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
})

module.exports = { createWebsiteValidation, updateWebsiteValidation }