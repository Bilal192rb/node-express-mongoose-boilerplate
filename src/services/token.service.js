const jsonWebToken = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const { jwt } = require('../config/env');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');

const generateToken = (userId, expires, data, type, secret = jwt.secret) => {
    const payload = {
        sub: userId,
        data,
        type,
        iat: moment().unix(),
        exp: expires.unix(),
    };
    return jsonWebToken.sign(payload, secret);
};

const saveToken = async (token, userId, expires) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expiresAt: expires,
    });
    return tokenDoc;
};

const verifyToken = async (token) => {
    const payload = jsonWebToken.verify(token, jwt.secret);
    const tokenDoc = await Token.findOne({
        token,
        user: payload.sub,
        expiresAt: {
            $gt: moment().toDate(),
        },
    });
    if (!tokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid or Expired Token');
    }
    return tokenDoc;
};

const generateAuthTokens = async (user) => {
    const authToken = generateAuthToken(user);
    const accessToken = generateAccessToken(user);

    await saveToken(authToken.auth.token, user.id, authToken.auth.expires);

    return {
        auth: authToken.auth,
        access: accessToken.access,
    };
};

const generateAuthToken = (user) => {
    const authTokenExpires = moment().add(jwt.authExpireTime, 'minutes');
    const authToken = generateToken(user.id, authTokenExpires, user, 'AUTH');

    return {
        auth: {
            token: authToken,
            expires: authTokenExpires.toDate(),
        },
    };
};

const generateAccessToken = (user) => {
    const accessTokenExpires = moment().add(jwt.accessExpireTime, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, user, 'ACCESS');

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    };
};

const generateResetPasswordToken = async (email) => {
    return null;
};

const generateVerifyEmailToken = async (user) => {
    return null;
};

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateAuthToken,
    generateAccessToken,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
