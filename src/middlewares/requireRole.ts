import type { Request, Response, NextFunction } from "express";

export const requireRole =
  (role: "user" | "admin") => (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }
    next();
  };
