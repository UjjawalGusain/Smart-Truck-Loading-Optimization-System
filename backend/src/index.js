import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./db/connect.js";

import authRouter from "./routes/auth.route.js";


const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

try {
    connectDB();
} catch (error) {
    console.error("Error connecting to db: ", error);
}


app.use('/api/auth', authRouter);
const corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
