import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource tidak ditemukan.") {
    super(404, "NOT_FOUND", message);
  }
}

export class RestrictViolationError extends AppError {
  constructor(message: string) {
    super(409, "RESTRICT_VIOLATION", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Data sudah ada.") {
    super(409, "CONFLICT", message);
  }
}

/**
 * Global error handler middleware.
 * Catches and normalizes all errors into a consistent JSON response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // --- Zod validation errors ---
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Data yang dikirim tidak valid.",
      details: issues,
    });
    return;
  }

  // --- Custom application errors ---
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
    });
    return;
  }

  // --- Prisma known errors ---
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field";
      res.status(409).json({
        success: false,
        error: "UNIQUE_CONSTRAINT",
        message: `Data dengan ${target} tersebut sudah ada.`,
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Data tidak ditemukan.",
      });
      return;
    }
    if (err.code === "P2003") {
      res.status(409).json({
        success: false,
        error: "FOREIGN_KEY_CONSTRAINT",
        message: "Operasi gagal karena ada data terkait yang masih terhubung.",
      });
      return;
    }
  }

  // --- Unknown errors ---
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_ERROR",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Terjadi kesalahan internal pada server.",
  });
}
