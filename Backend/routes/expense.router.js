import express from 'express' ;
import { addExpense, deleteExpense, downloadexpenseData, getAllExpense, updateAllExpense,getExpenseOverview } from "../controller/expenseController.js";
import authmiddleware from "../middleware/auth.js"

const expenseRouter = express.Router();

expenseRouter.post("/add",authmiddleware,addExpense);
expenseRouter.get("/get",authmiddleware,getAllExpense);

// put 
expenseRouter.put("/update/:id",authmiddleware,updateAllExpense);
expenseRouter.get("/download",authmiddleware,downloadexpenseData)

expenseRouter.delete("/delete/:id",authmiddleware,deleteExpense);
expenseRouter.get("/overview",authmiddleware,getExpenseOverview);

export default expenseRouter ;

