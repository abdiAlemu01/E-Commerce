import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  // Calculate prices
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
    }

    const subtotal = product.price * item.quantity;
    itemsPrice += subtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      subtotal,
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const taxPrice = itemsPrice * 0.15; // 15% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully',
  });
});

// @desc    Get user orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  const total = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user is order owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  const total = await Order.countDocuments();
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: getPaginationMeta(total, page, limit),
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.orderStatus = status;
  order.statusHistory.push({
    status,
    note: note || '',
  });

  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  if (status === 'cancelled') {
    order.cancelledAt = Date.now();
    order.cancellationReason = note;
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user is order owner
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  if (order.orderStatus !== 'pending') {
    return next(new ErrorResponse('Cannot cancel order that is already being processed', 400));
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = Date.now();
  order.cancellationReason = req.body.reason || 'Cancelled by customer';

  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  });
});
