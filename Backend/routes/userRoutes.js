import  { Router } from 'express';

import * as authController from '../controller/usercontroller.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = Router();


userRouter.post("/register",authController.registerUser);
userRouter.post("/login",authController.loginUser) ;

// protected routes 
userRouter.get("/get",authMiddleware,authController.getCurrentUser) ;
userRouter.put("/profile",authMiddleware,authController.updateUser);
userRouter.put("/password",authMiddleware,authController.updatePassword);


export default userRouter ;