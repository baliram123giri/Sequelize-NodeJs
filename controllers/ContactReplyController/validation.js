const Joi = require("joi");

const createContactEmailReplyValidation = Joi.object({
    contactId: Joi.string().required(),
    comment: Joi.string().required(),
    contactEmailId: Joi.string().required(),
})

module.exports = { createContactEmailReplyValidation }