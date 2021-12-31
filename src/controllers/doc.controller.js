const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const httpStatus = require('http-status');

const documentation = catchAsync(async (req, res) => {
    new ApiResponse(httpStatus.NOT_IMPLEMENTED, httpStatus[httpStatus.NOT_IMPLEMENTED]).send(res);
});

module.exports = {
    documentation,
};
