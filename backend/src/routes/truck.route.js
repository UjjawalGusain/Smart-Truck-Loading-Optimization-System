import truckController from "../controllers/truck.controller.js";
import verifyJWT from "../middlewares/verifyJwt.js";
import { Router } from "express";

const truckRouter = Router();

truckRouter.post('/create-many', verifyJWT, truckController.createTrucks);

export default truckRouter;
