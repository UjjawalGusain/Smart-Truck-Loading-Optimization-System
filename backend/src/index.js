import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./db/connect.js";

const app = express();
const PORT = process.env.PORT;

try {
    connectDB();
} catch (error) {
    console.error("Error connecting to db: ", error);
}


const corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
