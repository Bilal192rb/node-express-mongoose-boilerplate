const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};

const logout = async (authToken) => {
    const authTokenDoc = await Token.findOne({ token: authToken });
    if (!authTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    return await authTokenDoc.delete();
};

const refreshAuth = async (authToken) => {
    try {
        const authTokenDoc = await tokenService.verifyToken(authToken);
        const user = await userService.getUserById(authTokenDoc.user);
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }
        return tokenService.generateAccessToken(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
    return null;
};

const verifyEmail = async (verifyEmailToken) => {
    return null;
};

module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
};
