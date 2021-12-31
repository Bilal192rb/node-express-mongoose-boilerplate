const httpStatus = require('http-status');
const { Category, Brand } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (categoryBody) => {
    if (await Category.isNameTaken(categoryBody.name)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category with this name already exist');
    }
    return await Category.create(categoryBody);
};

const queryCategories = async (filter, options) => {
    return await Category.paginate(filter, options);
};

const getCategoryById = async (id) => {
    return await Category.findById(id);
};

const getCategoryByName = async (name) => {
    return await Category.findOne({ name });
};

const updateCategoryById = async (categoryId, updateBody) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    if (updateBody.name && (await Category.isNameTaken(updateBody.name, categoryId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category with this name already exist');
    }
    Object.assign(category, updateBody);
    return await category.save();
};

const deleteCategoryById = async (categoryId) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return await category.delete();
};

module.exports = {
    createCategory,
    queryCategories,
    getCategoryById,
    getCategoryByName,
    updateCategoryById,
    deleteCategoryById,
};
