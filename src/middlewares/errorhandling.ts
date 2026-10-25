import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "CastError") {
  return res.status(400).json({ error: { message: "Invalid id" } });
}
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message || "Server error" } });
};

export default errorHandler;
