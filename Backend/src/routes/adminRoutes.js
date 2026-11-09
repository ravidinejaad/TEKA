import express from 'express';
import {
  getSystemAnalytics,
  getDashboardSummary,
  getTeacherRankings,
  getStudentActivity,
  getSystemHealth
} from '../controllers/adminController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Admin only routes
router.get('/analytics', verifyToken, authorize('admin'), getSystemAnalytics);
router.get('/dashboard', verifyToken, authorize('admin'), getDashboardSummary);
router.get('/teachers/rankings', verifyToken, authorize('admin'), paginationValidation, getTeacherRankings);
router.get('/students/activity', verifyToken, authorize('admin'), paginationValidation, getStudentActivity);
router.get('/health', verifyToken, authorize('admin'), getSystemHealth);

export default router;
