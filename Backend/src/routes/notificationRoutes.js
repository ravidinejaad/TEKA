import express from 'express';
import {
  getUserNotifications,
  getUnreadCount_,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';
import { idValidation, paginationValidation } from '../middleware/validation.js';

const router = express.Router();

// Protected routes
router.get('/', verifyToken, paginationValidation, getUserNotifications);
router.get('/unread-count', verifyToken, getUnreadCount_);
router.put('/:id/read', verifyToken, idValidation, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);
router.delete('/:id', verifyToken, idValidation, deleteNotification);

export default router;
