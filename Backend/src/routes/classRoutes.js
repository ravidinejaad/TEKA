import express from 'express';
import {
  createClass,
  getUserClasses,
  getClassDetail,
  updateClass,
  deleteClass,
  joinClass,
  getClassMembers,
  removeClassMember
} from '../controllers/classController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
import { classValidation, joinClassValidation, idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.get('/', verifyToken, paginationValidation, getUserClasses);
router.post('/join', verifyToken, authorize('student'), joinClassValidation, joinClass);

// Class routes
router.post('/', verifyToken, authorize('teacher'), classValidation, createClass);
router.get('/:id', verifyToken, idValidation, getClassDetail);
router.put('/:id', verifyToken, authorize('teacher'), idValidation, classValidation, updateClass);
router.delete('/:id', verifyToken, authorize('teacher'), idValidation, deleteClass);

// Class members routes
router.get('/:id/members', verifyToken, authorize('teacher'), idValidation, paginationValidation, getClassMembers);
router.delete('/:id/members/:memberId', verifyToken, authorize('teacher'), removeClassMember);

export default router;
