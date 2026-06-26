import express from "express"
const dashBoardRouter = express.Router();
import authMiddleware from "../middleware/auth.js";
import { dashboardView } from "../controller/dashboardController.js";

dashBoardRouter.get("/",authMiddleware,dashboardView);

export default dashBoardRouter ;