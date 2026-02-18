import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { ca } from "zod/v4/locales";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData || !decodedData.id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
      });
    }
    const cacheUser = await redisClient.get(`user:${decodedData.id}`);

    if (cacheUser) {
      req.userId = decodedData.id;
      req.user = JSON.parse(cacheUser);
      return next();
    }
    const user = await User.findById(decodedData.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await redisClient.setEx(
      `user:${decodedData.id}`,
      3600,
      JSON.stringify(user),
    );
    req.userId = decodedData.id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
