const ApiError = require('../utils/ApiError');
const Joi = require('joi');
const httpStatus = require('http-status');
const { pick } = require('underscore');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
            errors: {
                wrap: {
                    label: '',
                },
            },
        });
    if (error) {
        let errorData = {};
        error.details.forEach((detail) => {
            const lastKey = detail.path.pop();
            const lastObj = detail.path.reduce((errorData, key) => (errorData[key] = errorData[key] || {}), errorData);
            lastObj[lastKey] = detail.message;
        });
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid data', errorData));
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;
