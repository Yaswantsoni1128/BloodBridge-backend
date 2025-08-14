import express from "express";
import inventorySettingsController from "../controllers/inventorySettings.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/set", validateJWT, inventorySettingsController.setSettings);
router.get("/get", validateJWT, inventorySettingsController.getSettings);

export default router;
