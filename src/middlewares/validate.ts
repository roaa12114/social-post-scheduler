import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType, source: "body" | "query" = "body") => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
 
if (!result.success) {
  return res
    .status(400)
    .json({ message: "Validation failed", details: result.error.issues });
}
if(source === "body") req.body = result.data;
else res.locals.query = result.data;
next();
};
