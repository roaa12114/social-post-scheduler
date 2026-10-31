import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "CastError") {
    return res.status(400).json({ error: { message: "Invalid id" } });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: { message: "Resource already exists" } });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);   // التفاصيل في الـ log بس
  res.status(status).json({
    error: { message: status === 500 ? "Internal server error" : err.message },
  });
};

export default errorHandler;
