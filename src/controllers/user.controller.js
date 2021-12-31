const httpStatus = require('http-status');
const { pick } = require('underscore');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { user }).send(res);
});

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['email', 'contactNumber', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'pagination']);
    const users = await userService.queryUsers(filter, options);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { users }).send(res);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { user }).send(res);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { user }).send(res);
});

const deleteUser = catchAsync(async (req, res) => {
    const user = await userService.deleteUserById(req.params.userId);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { user }).send(res);
});

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
