import express from "express";
import { getTrips, createTrip, updateTrip } from "../controllers/tripController.js";

const router = express.Router();

// Obtener todos los viajes
router.get("/", getTrips);

// Crear un viaje nuevo
router.post("/", createTrip);

// Actualizar cupos del viaje
router.put("/:id", updateTrip); 

export default router;

