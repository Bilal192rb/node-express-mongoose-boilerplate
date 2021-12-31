const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        contactNumber: Joi.string().required(),
        gender: Joi.string().required().valid('male', 'female'),
        educationLevel: Joi.number().integer().required(),
        password: Joi.string().required().custom(password),
        role: Joi.string().required().valid('admin', 'manager', 'enumerator', 'user'),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        email: Joi.string(),
        contactNumber: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        pagination: Joi.bool(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            email: Joi.string().email(),
            contactNumber: Joi.string(),
            gender: Joi.string().valid('male', 'female'),
            educationLevel: Joi.number().integer(),
            password: Joi.string().custom(password),
            role: Joi.string().valid('admin', 'manager', 'enumerator', 'user'),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
