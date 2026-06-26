import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
description : {
    type : String,
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  category: {
    type: String,
    required : true,
  },
  date: {
    type: Date,
    required : true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    default: "expense",  
  },

}, {
    timestamps:true
} ) ;
const expenseModel = mongoose.models.expense || mongoose.model("expense" , expenseSchema);
export default expenseModel ;