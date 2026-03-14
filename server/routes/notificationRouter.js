// notificationRouter.js
import express from 'express';
import {
  getUserNotifications,
  createNotification,
  updateNotificationStatus
} from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/auth.js';

const notificationRouter = express.Router();

notificationRouter.get("/", protectRoute, getUserNotifications);
notificationRouter.post("/", protectRoute, createNotification);
notificationRouter.put("/:id", protectRoute, updateNotificationStatus);

export default notificationRouter;
