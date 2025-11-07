import { listUsers, getUser } from "../controllers/userController.js";
import express from "express";
const router = express.Router();

router.get("/", listUsers);
router.get("/:id", getUser);

export default router;
