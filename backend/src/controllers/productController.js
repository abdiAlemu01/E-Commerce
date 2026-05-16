import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import APIFeatures from '../utils/apiFeatures.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  // Build query
  const features = new APIFeatures(
    Product.find({ isActive: true }).populate('category brand'),
    req.query
  )
    .search()
    .filter()
    .sort()
    .limitFields();

  // Get total count for pagination
  const total = await Product.countDocuments(features.query.getFilter());

  // Execute query with pagination
  const products = await features.query.skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    data: products,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category brand')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category brand')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
    message: 'Product updated successfully',
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category brand')
    .limit(12)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: products,
  });
});

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  })
    .populate('category brand')
    .limit(8)
    .sort('-rating');

  res.status(200).json({
    success: true,
    data: relatedProducts,
  });
});
