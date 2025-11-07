import { Router } from "express";
import Trip from "../models/Trip.model.js";

const router = router();

// Obtener todos los viajes
router.get("/", async (req, res) => {
  try {
    const viajes = await Trip.find();
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo viajes" });
  }
});

// Crear viaje
router.post("/", async (req, res) => {
  try {
    const nuevoViaje = new Trip(req.body);
    await nuevoViaje.save();
    res.json(nuevoViaje);
  } catch (err) {
    res.status(400).json({ error: "Error creando viaje" });
  }
});
export default router;