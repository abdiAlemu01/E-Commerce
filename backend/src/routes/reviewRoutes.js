import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, createReview);
router.get('/', getProductReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
