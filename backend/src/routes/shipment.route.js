import shipmentController from "../controllers/shipment.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const shipmentRouter = Router();

shipmentRouter.post('/', verifyJWT, shipmentController.createShipment);
shipmentRouter.get('/', verifyJWT, shipmentController.getShipments);
shipmentRouter.patch('/', verifyJWT, shipmentController.updateShipment);
shipmentRouter.delete('/:shipmentId', verifyJWT, shipmentController.deleteShipment);

export default shipmentRouter;
