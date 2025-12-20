import shipmentController from "../controllers/shipment.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const shipmentRouter = Router();

shipmentRouter.post('/create', verifyJWT, shipmentController.createShipment);


export default shipmentRouter;
