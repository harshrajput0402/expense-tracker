import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userroutes from './routes/userRoutes.js';
import incomeRouter from './routes/income.router.js';
import expenseRouter from './routes/expense.router.js';
import dashBoardRouter from './routes/dashboard.Router.js';
const app = express();


 


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user",userroutes);
app.use("/api/income",incomeRouter);
app.use("/api/expense",expenseRouter);
app.use("/api/dashboard",dashBoardRouter)



export default app;