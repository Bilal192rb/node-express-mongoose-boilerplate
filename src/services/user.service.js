const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (await User.isContactNumberTaken(userBody.contactNumber)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Contact Number already taken');
    }
    return await User.create(userBody);
};

const queryUsers = async (filter, options) => {
    return await User.paginate(filter, options);
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (updateBody.contactNumber && (await User.isContactNumberTaken(updateBody.contactNumber, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Contact Number already taken');
    }
    Object.assign(user, updateBody);
    return await user.save();
};

const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return await user.delete();
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
