import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create product review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res, next) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (existingReview) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  // Check if user purchased this product
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    orderStatus: 'delivered',
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({
    success: true,
    data: review,
    message: 'Review created successfully',
  });
});

// @desc    Get product reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this review', 403));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
    message: 'Review updated successfully',
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
