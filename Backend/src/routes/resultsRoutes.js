import express from 'express';
import {
  getQuizResults,
  getQuizAnalytics,
  getClassLeaderboard,
  getUserQuizHistory,
  getUserStatistics
} from '../controllers/resultsController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Quiz results (teacher)
router.get('/quizzes/:quizId', verifyToken, authorize('teacher'), idValidation, paginationValidation, getQuizResults);

// Quiz analytics (teacher)
router.get('/quizzes/:quizId/analytics', verifyToken, authorize('teacher'), idValidation, getQuizAnalytics);

// Leaderboard
router.get('/leaderboard/classes/:classId', verifyToken, idValidation, paginationValidation, getClassLeaderboard);

// User history and stats
router.get('/user/history', verifyToken, authorize('student'), paginationValidation, getUserQuizHistory);
router.get('/user/statistics', verifyToken, authorize('student'), getUserStatistics);

export default router;
