import express from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/bookingController.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.post("/", authenticate, requireRole("pasajero"), createBooking);
router.get("/my", authenticate, getMyBookings);
router.put("/:bookingId/cancel", authenticate, cancelBooking);

export default router;

