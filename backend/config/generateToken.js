import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

export const generateToken = async (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  const refreshTokenKey = `refresh-token:${id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenKey = `refresh-token:${decoded.id}`;
    const storedToken = await redisClient.get(refreshTokenKey);

    if (storedToken === refreshToken) {
      return decoded;
    }
    return null;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export const generateAccessToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 60 * 1000,
  });
};
