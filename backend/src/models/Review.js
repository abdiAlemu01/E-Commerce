import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Update product rating after review save
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.product);
});

// Update product rating after review delete
reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRating(this.product);
});

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, isApproved: true },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: stats[0]?.avgRating || 0,
      numReviews: stats[0]?.numReviews || 0,
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
