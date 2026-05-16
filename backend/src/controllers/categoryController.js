import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .populate('subcategories')
    .sort('order');

  res.status(200).json({
    success: true,
    data: categories,
  });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('subcategories');

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully',
  });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
    message: 'Category updated successfully',
  });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
