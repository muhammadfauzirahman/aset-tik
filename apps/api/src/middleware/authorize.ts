import type { Request, Response, NextFunction } from "express";

type Resource = "fasilitas" | "masterData" | "laporan";
type Action = "create" | "read" | "update" | "delete" | "export";

/**
 * Role-action permission matrix.
 * Mirrors the BetterAuth RBAC definitions for route-level enforcement.
 */
const permissionMatrix: Record<string, Record<Resource, Action[]>> = {
  admin: {
    fasilitas: ["create", "read", "update", "delete"],
    masterData: ["create", "read", "update", "delete"],
    laporan: ["read", "export"],
  },
  operator: {
    fasilitas: ["create", "read", "update"],
    masterData: ["create", "read", "update"],
    laporan: ["read"],
  },
  viewer: {
    fasilitas: ["read"],
    masterData: ["read"],
    laporan: ["read"],
  },
};

/**
 * Middleware: Check if the authenticated user has the required
 * permission (resource + action) based on their role.
 *
 * Usage: authorize("fasilitas", "create")
 */
export function authorize(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Autentikasi diperlukan.",
      });
      return;
    }

    const role = user.role || "viewer";
    const allowedActions = permissionMatrix[role]?.[resource] || [];

    if (!allowedActions.includes(action)) {
      res.status(403).json({
        success: false,
        error: "FORBIDDEN",
        message: `Anda tidak memiliki izin untuk ${action} pada ${resource}. Role Anda: ${role}.`,
      });
      return;
    }

    next();
  };
}
