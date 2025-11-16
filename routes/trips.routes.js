import express from "express";
import { 
  getTrips, 
  getTripById, 
  createTrip, 
  getMyTrips, 
  updateTrip, 
  cancelTrip 
} from "../controllers/tripController.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getTrips); // Con filtros en query params
router.get("/:id", getTripById);

// Rutas protegidas
router.post("/", authenticate, requireRole("conductor"), createTrip);
router.get("/my/trips", authenticate, requireRole("conductor"), getMyTrips);
router.put("/:id", authenticate, requireRole("conductor"), updateTrip);
router.delete("/:id", authenticate, requireRole("conductor"), cancelTrip);

export default router;
