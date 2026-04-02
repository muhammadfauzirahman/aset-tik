import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.js";

/**
 * Extends Express Request with user and session from BetterAuth
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      session?: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
      };
    }
  }
}

/**
 * Middleware: Verify BetterAuth session and inject user into request.
 * Returns 401 if no valid session found.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Sesi tidak valid. Silakan login terlebih dahulu.",
      });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || "viewer",
    };

    req.session = {
      id: session.session.id,
      token: session.session.token,
      userId: session.session.userId,
      expiresAt: session.session.expiresAt,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "UNAUTHORIZED",
      message: "Gagal memverifikasi sesi.",
    });
  }
}
