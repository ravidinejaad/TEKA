import express from 'express';
import {
  startQuizAttempt,
  getCurrentAttempt,
  saveAnswer,
  submitQuiz,
  getResults,
  getUserAttempts
} from '../controllers/quizAttemptController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { idValidation } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.post('/', verifyToken, authorize('student'), startQuizAttempt);
router.get('/:id', verifyToken, idValidation, getCurrentAttempt);
router.post('/:id/answers', verifyToken, authorize('student'), idValidation, saveAnswer);
router.post('/:id/submit', verifyToken, authorize('student'), idValidation, submitQuiz);
router.post('/:id/complete', verifyToken, authorize('student'), idValidation, submitQuiz); // Alias
router.get('/:id/results', verifyToken, idValidation, getResults);
router.get('/:id/result', verifyToken, idValidation, getResults); // Alias
router.get('/quiz/:quizId/history', verifyToken, authorize('student'), idValidation, getUserAttempts);
router.get('/history', verifyToken, authorize('student'), getUserAttempts);

export default router;
