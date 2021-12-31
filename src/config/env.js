const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const environmentVariablesSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_AUTH_EXPIRE_TIME: Joi.number().default(30).description('minutes after which auth tokens expire'),
        JWT_ACCESS_EXPIRE_TIME: Joi.number()
            .default(30 * 24 * 60)
            .description('minutes after which access tokens expire'),
    })
    .unknown()
    .required();

const { value: environmentVariables, error } = environmentVariablesSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    server: {
        env: environmentVariables.NODE_ENV,
        port: environmentVariables.PORT,
    },
    jwt: {
        secret: environmentVariables.JWT_SECRET,
        authExpireTime: environmentVariables.JWT_AUTH_EXPIRE_TIME,
        accessExpireTime: environmentVariables.JWT_ACCESS_EXPIRE_TIME,
    },
    database: {
        url: environmentVariables.MONGODB_URL,
    },
};
