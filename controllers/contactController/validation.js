const Joi = require("joi");

const createContactValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    comment: Joi.string().required()
})

const updateContactValidation = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    comment: Joi.string().optional(),
    isRead: Joi.boolean().optional(),
    isJunk: Joi.boolean().optional(),
    isArchive: Joi.boolean().optional(),
})

module.exports = { createContactValidation, updateContactValidation }