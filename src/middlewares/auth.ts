import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export interface AuthPayload {
  sub: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { message: "Unauthorized" } });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as AuthPayload;
    const user = await User.findById(payload.sub).select("isActive role");
    if (!user || !user.isActive) {
      return res.status(401).json({ error: { message: "Account is deactivated" } });
    }
    req.user = { sub: payload.sub, role: user.role as "user" | "admin" };
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
};
