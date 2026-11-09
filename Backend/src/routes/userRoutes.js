import express from 'express';
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  getUserStats,
  getAllUsers,
  updateUserStatus
} from '../controllers/userController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import {
  updateProfileValidation,
  changePasswordValidation,
  paginationValidation,
  idValidation
} from '../middleware/validation.js';

const router = express.Router();

// Protected routes - User info
router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateProfileValidation, updateProfile);
router.put('/me/password', verifyToken, changePasswordValidation, changePassword);
router.get('/me/stats', verifyToken, getUserStats);

// Admin routes
router.get('/all', verifyToken, authorize('admin'), paginationValidation, getAllUsers);
router.put('/:id/status', verifyToken, authorize('admin'), idValidation, updateUserStatus);

export default router;
