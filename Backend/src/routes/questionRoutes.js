import express from 'express';
import {
  createQuestion,
  getTeacherQuestions,
  getQuestionDetail,
  updateQuestion,
  deleteQuestion,
  searchQuestions
} from '../controllers/questionController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { questionValidation, idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.post('/', verifyToken, authorize('teacher'), questionValidation, createQuestion);
router.get('/', verifyToken, authorize('teacher'), paginationValidation, getTeacherQuestions);
router.post('/search', verifyToken, authorize('teacher'), paginationValidation, searchQuestions);
router.get('/:id', verifyToken, idValidation, getQuestionDetail);
router.put('/:id', verifyToken, authorize('teacher'), idValidation, questionValidation, updateQuestion);
router.delete('/:id', verifyToken, authorize('teacher'), idValidation, deleteQuestion);

export default router;
