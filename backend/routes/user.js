import express from "express";
import {
  loginUser,
  myProfile,
  refreshToken,
  registerUser,
  verifyLoginOtp,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/profile", isAuth, myProfile);
router.post("/refresh-token", refreshToken);

export default router;
