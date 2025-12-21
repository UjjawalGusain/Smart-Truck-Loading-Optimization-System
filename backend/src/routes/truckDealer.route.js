import truckDealerController from "../controllers/truckDealer.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/verifyJwt.js";

const truckDealerRouter = Router();

truckDealerRouter.post('/sign', verifyJWT, truckDealerController.signAsTruckDealer);
truckDealerRouter.get('/', verifyJWT, truckDealerController.getTruckDealer);
truckDealerRouter.get('/dashboard-kpi', verifyJWT, truckDealerController.dashboardKpi);
truckDealerRouter.get('/:truckDealerId', verifyJWT, truckDealerController.getTrucks);

export default truckDealerRouter;
