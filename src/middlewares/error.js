const { server } = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (server.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const error = {
        ...(server.env === 'development' ? { stack: err.stack, error: err.error } : { error: err.error }),
    };
    if (server.env === 'development') {
        logger.error(err);
    }
    new ApiResponse(statusCode, message, error).send(res);
};

module.exports = {
    errorConverter,
    errorHandler,
};
