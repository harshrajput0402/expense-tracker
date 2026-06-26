import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utiles/utiles.js";


// add expense 
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        if (!description || !amount || !category || !date) {
            return res.status(404).json({
                success: false,
                message: "invalid input"
            })
        }

        const newexpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date),
        });
        await newexpense.save();
        res.status(200).json({
            success: true,
            message: "expense created"
        })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            message: "server error"
        });
    }
}

// get all expense 

export async function getAllExpense(req, res) {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            expense
        })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            message: "server error"
        });
    }
}

// update all expense 

export async function updateAllExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body
    if (!description || !amount) {
        res.status(404).json({
            success: false,
            message: "input field are required"
        })
    }
    try {
        const updateExpense = await expenseModel.findByIdAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        )
        if (!updateExpense) {
            return res.status(400).json({
                success: false,
                message: "update field not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "expense is updates",
            data: updateExpense

        })

    }
    catch (err) {
        console.log("error is", err);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }


}

// delete expense 

export async function deleteExpense(req, res) {
    try {
        const expense = await expenseModel.findByIdAndDelete({
            _id: req.params.id
        });
        if (!expense) {
            return res.status(404).json({
                sucess: true,
                message: " expense not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "expense delete successfully"
        })

    }
    catch (err) {
        console.log("error is", err);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

// download expense data 

export async function downloadexpenseData(req, res) {
    const userId = req.user._id;

    try {
        const expense = await expenseModel
            .find({ userId })
            .sort({ date: -1 });

        const planData = expense.map((exp) => ({
            Description: exp.description,   // ✅ fixed
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(planData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");

        const filePath = "expense_detail.xlsx";

        XLSX.writeFile(workbook, filePath); // ✅ correct

        res.download(filePath); // ✅ correct

    } catch (err) {
        console.log("error is", err);
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}

// get income overview 

export async function getExpenseOverview(req,res) {
try {
        const userId = req.user._id;
        const { range = "monthly" } = req.body;
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });



        const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpenses = expenses.length > 0 ? totalExpenses / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        
        
        const recentTransactions = expenses.slice(0, 9);
        res.json({
            success:true,
            data:{
                totalExpenses,
                averageExpenses,
                numberOfTransactions,
                recentTransactions
            }
        })
        }

    
    catch (err) {
        console.log("error is", err);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
};
