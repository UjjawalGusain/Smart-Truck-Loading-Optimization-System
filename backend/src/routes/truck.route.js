import truckController from "../controllers/truck.controller.js";
import verifyJWT from "../middlewares/verifyJwt.js";
import { Router } from "express";

const truckRouter = Router();

truckRouter.post('/create-many', verifyJWT, truckController.createTrucks);
truckRouter.delete('/', verifyJWT, truckController.deleteTruck);
truckRouter.patch('/', verifyJWT, truckController.updateTruck);
truckRouter.get('/truck-stats/:truckDealerId', verifyJWT, truckController.getTruckUtilization);

export default truckRouter;
