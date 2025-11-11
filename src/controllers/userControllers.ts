import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../config/zodConfig.js";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signUpController =  async (req:Request, res:Response) => {
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
  await UserModel.create({ name:username, email, password: hashedPassword });

  return res.status(201).json({ message: "User signed up successfully" });
}

export const signInController =  async (req:Request, res:Response) => {
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const { name } = user;
  const token = jwt.sign({ email, name }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return res.status(200).json({ message: "Login route", token });
}