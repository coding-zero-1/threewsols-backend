import { Router } from "express";
import { loginSchema, signupSchema } from "../config/zodConfig.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter: Router = Router();

userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the request body using Zod schema
  const parsedSchema = signupSchema.safeParse({ username, email, password });

  // If validation fails, send error response
  if (!parsedSchema.success) {
    return res.status(400).json({ errors: parsedSchema.error });
  }
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the database
  await UserModel.create({ username, email, password: hashedPassword });

  return res.status(201).json({ message: "User signed up successfully" });
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Validate the request body using Zod schema
  const parsedSchema = loginSchema.safeParse({ email, password });

  // If validation fails, send error response
  if (!parsedSchema.success) {
    return res.status(400).json({ errors: parsedSchema.error });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return res.status(200).json({ message: "Login route", token });
});

export default userRouter;