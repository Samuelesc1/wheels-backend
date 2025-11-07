import {Router} from "express";
import { listUsers, getUser } from "../controllers/userController.js";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUser);

export default router;
