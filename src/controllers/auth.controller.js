const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { authService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    new ApiResponse(httpStatus.CREATED, 'Login Successful', { user, tokens }).send(res);
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.authToken);
    new ApiResponse(httpStatus.NO_CONTENT, 'Logout Successful', {}).send(res);
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.authToken);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { tokens }).send(res);
});

const forgotPassword = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

const resetPassword = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

const verifyEmail = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
