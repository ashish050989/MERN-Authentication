import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(5, "Name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
