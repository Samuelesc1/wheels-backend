import express from "express";
import { getTrips, createTrip, updateTrip } from "../controllers/tripController.js";

const router = express.Router();

// Obtener todos los viajes
router.get("/trips", getTrips);

// Crear un viaje nuevo
router.post("/trips", createTrip);

// Actualizar cupos del viaje
router.put("/trips/:id", updateTrip); 

export default router;

