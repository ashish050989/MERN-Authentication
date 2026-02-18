import express from "express";
import { loginUser, registerUser, verifyUser } from "../controllers/user.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
// Allow GET so verification links (clicked in a browser) trigger verification
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);

export default router;
