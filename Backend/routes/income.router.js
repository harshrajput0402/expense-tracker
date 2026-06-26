import express from 'express' ;
import authMiddleware from "../middleware/auth.js";
import { addIncome, deleteIncome, downloadExcel, getAllIncome, getIncomeOverview, updateAllIncome } from '../controller/incomeController.js';

const incomeRoute = express.Router();

incomeRoute.post("/add",authMiddleware,addIncome);
incomeRoute.get("/get",authMiddleware,getAllIncome);


incomeRoute.put("/update/:id",authMiddleware,updateAllIncome)
incomeRoute.get("/downloadexcelfile",authMiddleware,downloadExcel)

incomeRoute.delete("/delete/:id",authMiddleware,deleteIncome);
incomeRoute.get("/overview",authMiddleware,getIncomeOverview);

export default incomeRoute ;






