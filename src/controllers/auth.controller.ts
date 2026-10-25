import { registerUser, loginUser } from "../services/auth.service.js";
import type { Request, Response } from "express";


export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await registerUser({ email, password });
  res.status(201).json({
    message: "User registered successfully",
    id: user._id,
    email: user.email,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginUser({ email, password });
  res.status(200).json({ message: "Login successful", token });
};

