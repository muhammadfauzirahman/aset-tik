import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

/**
 * ASETI-TIK RBAC Permission Definitions
 *
 * Resources & actions available in the system.
 * Shared between server (auth config) and can be imported by client.
 */
export const statement = {
  ...defaultStatements,
  fasilitas: ["create", "read", "update", "delete"],
  masterData: ["create", "read", "update", "delete"],
  laporan: ["read", "export"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Admin — Full access to everything
 */
export const adminRole = ac.newRole({
  fasilitas: ["create", "read", "update", "delete"],
  masterData: ["create", "read", "update", "delete"],
  laporan: ["read", "export"],
  ...adminAc.statements,
});

/**
 * Operator — Can create, read, update but NOT delete
 */
export const operatorRole = ac.newRole({
  fasilitas: ["create", "read", "update"],
  masterData: ["create", "read", "update"],
  laporan: ["read"],
});

/**
 * Viewer — Read-only access
 */
export const viewerRole = ac.newRole({
  fasilitas: ["read"],
  masterData: ["read"],
  laporan: ["read"],
});
