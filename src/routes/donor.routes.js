import express from "express";
import donorController from "../controllers/donor.controller.js"
import { validateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/addDonor", validateJWT, donorController.addDonor);
router.put("/updateDonor/:id", validateJWT, donorController.updateDonor);
router.delete("/deleteDonor/:id", validateJWT, donorController.deleteDonor);
router.get("/getDonor/:id", validateJWT, donorController.getDonorById);
router.get("/getAllDonors/", validateJWT, donorController.getAllDonors);

export default router;
