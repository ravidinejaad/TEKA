import express from 'express';
import {
  createQuiz,
  getClassQuizzes,
  getQuizDetail,
  getQuizQuestions,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  closeQuiz
} from '../controllers/quizController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { quizValidation, idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.post('/', verifyToken, authorize('teacher'), quizValidation, createQuiz);
router.get('/classes/:classId', verifyToken, paginationValidation, getClassQuizzes);
router.get('/:id', verifyToken, idValidation, getQuizDetail);
router.get('/:id/questions', verifyToken, idValidation, getQuizQuestions);
router.put('/:id', verifyToken, authorize('teacher'), idValidation, quizValidation, updateQuiz);
router.delete('/:id', verifyToken, authorize('teacher'), idValidation, deleteQuiz);
router.post('/:id/publish', verifyToken, authorize('teacher'), idValidation, publishQuiz);
router.post('/:id/close', verifyToken, authorize('teacher'), idValidation, closeQuiz);

export default router;
