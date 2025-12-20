import warehouseController from "../controllers/warehouse.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const warehouseRouter = Router();

warehouseRouter.post("/create", verifyJWT, warehouseController.createWarehouse);
warehouseRouter.get("/get-warehouses", verifyJWT, warehouseController.getAllWarehouses);
export default warehouseRouter;
