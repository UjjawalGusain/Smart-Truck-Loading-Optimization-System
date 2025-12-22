import warehouseController from "../controllers/warehouse.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const warehouseRouter = Router();

warehouseRouter.post("/create", verifyJWT, warehouseController.createWarehouse);
warehouseRouter.get("/get-warehouses", verifyJWT, warehouseController.getAllWarehouses);
warehouseRouter.post("/best-fit-truck", verifyJWT, warehouseController.bestFitTruck);
warehouseRouter.post("/best-fit-calculator", verifyJWT, warehouseController.bestFitTruckFromInput);
warehouseRouter.post("/booked-email", verifyJWT, warehouseController.sendBookedEmail);
warehouseRouter.get("/shipment-stats/:warehouseId", verifyJWT, warehouseController.getShipmentStats);
export default warehouseRouter;
