import sanitize from "mongo-sanitize";
import TryCatch from "../middlewares/tryCatch.js";
import { registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import { sendMail } from "../config/sendMail.js";
import { getVerifyEmailHtml } from "../config/html.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validationResult = registerSchema.safeParse(sanitezedBody);
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
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  const subject = "Verify your email";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  console.log(`Subject: ${subject}`);
  console.log(`HTML: ${html}`);

  await sendMail({ to: email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  //await newUser.save();

  res.status(201).json({
    success: true,
    message:
      "if your email is valid, you will receive a verification email shortly and expires in 5 minutes",
  });
});
