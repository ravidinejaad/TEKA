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
router.get('/:id/results', verifyToken, idValidation, getResults);
router.get('/quiz/:quizId/history', verifyToken, authorize('student'), idValidation, getUserAttempts);

export default router;
