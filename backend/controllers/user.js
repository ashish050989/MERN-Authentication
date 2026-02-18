import sanitize from "mongo-sanitize";
import TryCatch from "../middlewares/tryCatch.js";
import { loginSchema, registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import { sendMail } from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validationResult = registerSchema.safeParse(sanitizedBody);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationResult.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  const { name, email, password } = validationResult.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      success: false,
      message: "Too many registration attempts. Please try again later.",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify-token:${verifyToken}`;

  const dataToStore = JSON.stringify({
    name,
    email,
    password: hashedPassword,
  });

  await redisClient.set(verifyKey, dataToStore, { EX: 300 });

  const subject = "Verify your email";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ to: email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  //await newUser.save();

  res.status(201).json({
    success: true,
    message:
      "if your email is valid, you will receive a verification email shortly and expires in 5 minutes",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;
  if (token === undefined) {
    return res.status(400).json({
      success: false,
      message: "Token is required gggg",
    });
  }

  const verifyKey = `verify-token:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  await newUser.save();

  res.status(201).json({
    success: true,
    message: "Email verified successfully. Your account is created.",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validationResult = loginSchema.safeParse(sanitizedBody);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationResult.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  const { email, password } = validationResult.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `login-otp:${email}`;

  await redisClient.set(otpKey, otp, { EX: 300 });

  const subject = "Your login OTP";
  const html = getOtpHtml({ email, otp });

  await sendMail({ to: email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.status(200).json({
    success: true,
    message:
      "if your email is valid, you will receive a login OTP shortly and expires in 5 minutes",
  });
});
