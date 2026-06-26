import mongoose from "mongoose"; // Importing the Mongoose library to define the schema and model for MongoDB.

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})  

const usermodel = mongoose.models.User || mongoose.model('User', userSchema); 
// Creating a Mongoose model named 'User' based on the defined userSchema.
// The line checks if a model named 'User' already exists in mongoose.models. If it does, it uses that existing model;
//  otherwise, it creates a new model using mongoose.model('User', userSchema). This is a common pattern to avoid recompiling 
// the model if it has already been defined, which can happen in serverless environments or during hot-reloading in development.

export default usermodel;  // Exporting the usermodel to be used in other parts of the application.