import express from "express";
import { registerUser, verifyUser } from "../controllers/user.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
// Allow GET so verification links (clicked in a browser) trigger verification
router.get("/verify/:token", verifyUser);

export default router;
