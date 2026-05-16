import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getCategories);
router.get('/:id', cacheMiddleware(600), getCategory);

router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
