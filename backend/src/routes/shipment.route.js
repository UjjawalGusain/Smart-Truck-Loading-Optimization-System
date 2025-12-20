import shipmentController from "../controllers/shipment.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const shipmentRouter = Router();

shipmentRouter.post('/create', verifyJWT, shipmentController.createShipment);
shipmentRouter.get('/', verifyJWT, shipmentController.getShipments);

export default shipmentRouter;
