const Joi = require("joi");

const createUserValidation = Joi.object({
    first_name: Joi.string().required(),
    middle_name: Joi.string().optional(),
    last_name: Joi.string().required(),
    WebsiteId: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    UserTypeId: Joi.string().required(),
    mobile: Joi.string().required(),
    is_active: Joi.boolean().optional()
})
const updateUserValidation = Joi.object({
    first_name: Joi.string().optional(),
    middle_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    WebsiteId: Joi.string().required(),
    UserTypeId: Joi.string().optional(),
    mobile: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
    first_time_login: Joi.boolean().optional(),
})
const loginUserValidations = Joi.object(
    {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }
)
module.exports = { createUserValidation, updateUserValidation, loginUserValidations }