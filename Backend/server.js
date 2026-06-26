
import app from "./index.js"
import { connectDB } from './config/db.js'; 

// db
connectDB();

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening on port 3000`);
});

