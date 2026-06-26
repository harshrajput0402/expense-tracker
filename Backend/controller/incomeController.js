import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utiles/utiles.js";

// add income 

export async function addIncome(req, res) {
    const userId = req.user._id
    // user._id mongodb id 

    const { description, amount, date, category } = req.body;
    try {
        if (!category || !amount || !description || !date) {
            res.status(404).json({
                success: false,
                message: "input field are required."
            })
        };

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json({
            sucess: true,
            message: "Income added succesfully."
        })
    }
    catch (err) {
        console.log("error is", err);
        res.status(500).json({
            success: false,
            message: "server error in try block."
        })
    }
}
// to get the income 

export async function getAllIncome(req, res) {
    const userId = req.user._id
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        res.json({
            success: true,
            income
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

// update income 
export async function updateAllIncome(req, res) {
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
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { new: true }
        );
        if (!updatedIncome) {
            res.status(404).json({
                success: false,
                message: "updated income not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "income is updates",
            data: updatedIncome

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
// delete income 
export async function deleteIncome(req, res) {
    try {
        const income = await incomeModel.findByIdAndDelete({ _id: req.params.id })
        if (!income) {
            res.status(404).json({
                success: false,
                message: "income not found "
            });
        }
        res.status(200).json({
            success: true,
            message: "income is deleted",

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

// to download the data in excel sheet 
export async function downloadExcel(req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel
            .find({ userId })
            .sort({ date: -1 });

        const planData = income.map((inn) => ({
            Description: inn.description,   // ✅ fixed
            Amount: inn.amount,
            Category: inn.category,
            Date: new Date(inn.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(planData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

        const filePath = "income_detail.xlsx";

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
// to get income overview here 
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const range = req.query?.range || "monthly";
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });



        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);
        res.json({
            success:true,
            data:{
                totalIncome,
                averageIncome,
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
}
