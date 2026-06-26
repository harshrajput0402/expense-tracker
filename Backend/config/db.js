import mongoose from "mongoose"; // Importing the Mongoose library to interact with MongoDB.
const URL = process.env.URI;

export const connectDB = async () => {
    await mongoose.connect(URL)
    .then(() => {
        console.log("Connected to MongoDB");
    }   );
}