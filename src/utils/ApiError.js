class ApiError extends Error {
    constructor(statusCode, message, error, isOperational = true, stack = null) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;
