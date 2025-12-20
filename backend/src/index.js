import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import warehouseRouter from "./routes/warehouse.route.js";
import truckDealerRouter from "./routes/truckDealer.route.js";


const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


try {
    connectDB();
} catch (error) {
    console.error("Error connecting to db: ", error);
}


app.use('/api/auth', authRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/truck-dealer', truckDealerRouter);
const corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
