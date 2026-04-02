import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware factory: Validates request body against a Zod schema.
 * Passes parsed (typed) data as req.body on success.
 * Throws ZodError on failure (caught by errorHandler).
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Let the global errorHandler handle ZodError
      next(result.error);
      return;
    }

    // Replace body with parsed & validated data
    req.body = result.data;
    next();
  };
}
