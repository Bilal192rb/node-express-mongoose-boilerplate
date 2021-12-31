const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    }),
};

const getCategories = {
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        pagination: Joi.bool(),
    }),
};

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId),
    }),
};

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
        })
        .min(1),
};

const deleteCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
