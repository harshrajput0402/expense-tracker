import mongoose, { Schema } from "mongoose";

const incomeschema = new Schema({
    description: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true,

    },
    category: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    type: {
        type: String,
       default:"income"
    }
},{
    timestamps:true})

   const incomemodel = mongoose.models.income || mongoose.model("income",incomeschema);
   export default incomemodel;