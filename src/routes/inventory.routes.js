import express from "express";
import inventoryController from "../controllers/inventory.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.post("/createInventory", validateJWT, inventoryController.createInventory);
router.get("/getAllInventory", validateJWT, inventoryController.getAllInventory);
router.get("/getHospitalInventory", validateJWT, inventoryController.getHospitalInventory);
router.put("/updateInventory/:id", validateJWT, inventoryController.updateInventory);
router.delete("/deleteInventory/:id", validateJWT, inventoryController.deleteInventory);

export default router;
