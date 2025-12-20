import truckDealerController from "../controllers/truckDealer.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const truckDealerRouter = Router();

truckDealerRouter.post('/sign', verifyJWT, truckDealerController.signAsTruckDealer);

export default truckDealerRouter;
