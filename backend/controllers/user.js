import sanitize from "mongo-sanitize";
import TryCatch from "../middlewares/tryCatch.js";
import { registerSchema } from "../config/zod.js";

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
  res.json({ name, email, password });

  //res.send("Register User");
});
