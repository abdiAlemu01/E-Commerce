import express from 'express';
import upload from '../config/upload.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Upload product image
// @route   POST /api/v1/upload/product
// @access  Private/Admin
router.post('/product', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file',
      });
    }

    // Return the file path
    const imageUrl = `/uploads/products/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading image',
    });
  }
});

export default router;
