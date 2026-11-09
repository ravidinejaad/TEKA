import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { categoryValidation, idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', paginationValidation, getAllCategories);
router.get('/:id', idValidation, getCategoryById);

// Admin routes
router.post('/', verifyToken, authorize('admin'), categoryValidation, createCategory);
router.put('/:id', verifyToken, authorize('admin'), idValidation, categoryValidation, updateCategory);
router.delete('/:id', verifyToken, authorize('admin'), idValidation, deleteCategory);

export default router;
