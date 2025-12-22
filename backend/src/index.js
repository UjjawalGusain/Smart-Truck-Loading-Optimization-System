import express from "express";
import cors from "cors";
import "dotenv/config";
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

app.use(cors({
    origin: [process.env.ALLOWED_ORIGIN],
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/warehouse", warehouseRouter);
app.use("/api/truck-dealer", truckDealerRouter);
app.use("/api/user", userRouter);
app.use("/api/shipment", shipmentRouter);
app.use("/api/truck", truckRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

    } catch (error) {
        console.error("Fatal DB connection error:", error);
        process.exit(1);
    }
};

startServer();
