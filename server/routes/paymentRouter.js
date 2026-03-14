// paymentRouter.js
import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protectRoute } from '../middleware/auth.js';

const paymentRouter = express.Router();

paymentRouter.post("/create-order",  createOrder);
paymentRouter.post("/verify-payment", verifyPayment);

export default paymentRouter;
