import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import warehouseRouter from "./routes/warehouse.route.js";
import truckDealerRouter from "./routes/truckDealer.route.js";
import userRouter from "./routes/user.route.js";
import shipmentRouter from "./routes/shipment.route.js";
import truckRouter from "./routes/truck.route.js";

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

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
app.use('/api/user', userRouter);
app.use('/api/shipment', shipmentRouter);
app.use('/api/truck', truckRouter);


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
