import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRelatedProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { cacheMiddleware } from '../middlewares/cache.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// Re-route into review routes
router.use('/:productId/reviews', reviewRoutes);

router.get('/', cacheMiddleware(600), getProducts);
router.get('/featured', cacheMiddleware(600), getFeaturedProducts);
router.get('/slug/:slug', cacheMiddleware(600), getProductBySlug);
router.get('/:id', cacheMiddleware(600), getProduct);
router.get('/:id/related', cacheMiddleware(600), getRelatedProducts);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
