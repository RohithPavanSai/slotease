import express from 'express';
import { signup ,login } from '../controllers/AuthControllers.js'; // make sure the file name is correct

const userRouter = express.Router();

// Signup route
userRouter.post("/signup", signup);
userRouter.post("/login", login);

export default userRouter;
