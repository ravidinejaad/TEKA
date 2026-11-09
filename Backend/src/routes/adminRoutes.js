import express from 'express';
import {
  getSystemAnalytics,
  getDashboardSummary,
  getTeacherRankings,
  getStudentActivity,
  getSystemHealth,
  getAdminStats,
  getRecentActivity,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  testCreateUser,
  getAllQuizzes,
  deleteQuiz
} from '../controllers/adminController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Admin only routes
router.get('/analytics', verifyToken, authorize('admin'), getSystemAnalytics);
router.get('/dashboard', verifyToken, authorize('admin'), getDashboardSummary);
router.get('/stats', verifyToken, authorize('admin'), getAdminStats);
router.get('/activity', verifyToken, authorize('admin'), getRecentActivity);
router.get('/teachers/rankings', verifyToken, authorize('admin'), paginationValidation, getTeacherRankings);
router.get('/students/activity', verifyToken, authorize('admin'), paginationValidation, getStudentActivity);
router.get('/health', verifyToken, authorize('admin'), getSystemHealth);

// User Management
router.get('/users', verifyToken, authorize('admin'), getAllUsers);
router.post('/users', verifyToken, authorize('admin'), createUser);
router.put('/users/:id', verifyToken, authorize('admin'), updateUser);
router.delete('/users/:id', verifyToken, authorize('admin'), deleteUser);

// Quiz Management
router.get('/quizzes', verifyToken, authorize('admin'), getAllQuizzes);
router.delete('/quizzes/:id', verifyToken, authorize('admin'), deleteQuiz);

// Test endpoint (untuk debugging)
router.post('/test-create-user', verifyToken, authorize('admin'), testCreateUser);

export default router;
