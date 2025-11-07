import express from "express";
import { register, login } from "../controllers/authController.js";

const router = router();

router.post("/register", register);
router.post("/login", login);

export default router;
