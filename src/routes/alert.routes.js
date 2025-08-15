import alertController from "../controllers/alert.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

import express from 'express';
const alertRouter = express.Router();

//protected routes
alertRouter.post('/', validateJWT,  alertController.createAlert);
alertRouter.put('/:id', validateJWT,  alertController.updateAlert);
alertRouter.delete('/:id', validateJWT,  alertController.deleteAlert);
alertRouter.get('/hospital', validateJWT, alertController.getAllAlertsOfHospital)
alertRouter.put('/resolve/:id', validateJWT, alertController.resolveAlert)


//public routes
alertRouter.get('/:id',  alertController.getAlertById);
alertRouter.get('/',  alertController.getAllAlerts);

export default alertRouter;