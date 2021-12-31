const httpStatus = require('http-status');
const { pick } = require('underscore');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { category }).send(res);
});

const getCategories = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'pagination']);
    const categories = await categoryService.queryCategories(filter, options);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { categories }).send(res);
});

const getCategory = catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.categoryId);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { category }).send(res);
});

const updateCategory = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { category }).send(res);
});

const deleteCategory = catchAsync(async (req, res) => {
    const category = await categoryService.deleteCategoryById(req.params.categoryId, req.body);
    new ApiResponse(httpStatus.OK, httpStatus[httpStatus.OK], { category }).send(res);
});

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
