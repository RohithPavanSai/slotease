// reviewRouter.js
import express from 'express';
import {
  addReview,
  getReviewsBySalon,
  getReviewsByStylist,
  getReviewsByService
} from '../controllers/reviewController.js';
import { protectRoute } from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post("/", protectRoute, addReview);
reviewRouter.get("/salon/:salonId", getReviewsBySalon);
reviewRouter.get("/stylist/:stylistId", getReviewsByStylist);
reviewRouter.get("/service/:serviceId", getReviewsByService);

export default reviewRouter;
