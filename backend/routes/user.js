import express from "express";
import {
  loginUser,
  registerUser,
  verifyLoginOtp,
  verifyUser,
} from "../controllers/user.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOtp);

export default router;
