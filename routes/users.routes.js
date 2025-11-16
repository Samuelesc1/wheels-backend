import express from "express";
import { getMyProfile, getUser, updateProfile, changeRole } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas protegidas
router.get("/me", authenticate, getMyProfile);
router.get("/:id", getUser);
router.put("/me", authenticate, updateProfile);
router.post("/change-role", authenticate, changeRole);

export default router;
