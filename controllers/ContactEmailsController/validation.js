const Joi = require("joi");

const createContactEmailValidation = Joi.object({
    WebsiteId: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    is_active: Joi.boolean().optional(),
    smtp_host: Joi.string().trim().required(),
    smtp_port: Joi.string().trim().required(),
    smtp_service: Joi.string().trim().required(),
    smtp_password: Joi.string().trim().required(),
})
const updateContactEmailValidation = Joi.object({
    WebsiteId: Joi.string().trim().optional(),
    email: Joi.string().trim().email().optional(),
    is_active: Joi.boolean().optional(),
    smtp_host: Joi.string().trim().optional(),
    smtp_port: Joi.string().trim().optional(),
    smtp_service: Joi.string().trim().optional(),
    smtp_password: Joi.string().trim().optional(),
})

module.exports = { createContactEmailValidation, updateContactEmailValidation }