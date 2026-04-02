import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { ac, adminRole, operatorRole, viewerRole } from "./permissions.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        operator: operatorRole,
        viewer: viewerRole,
      },
      defaultRole: "viewer",
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // update session every 24 hours
  },
  trustedOrigins: [env.CORS_ORIGIN],
});
