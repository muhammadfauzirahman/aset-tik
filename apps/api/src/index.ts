import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { env } from "./config/env.js";
import { auth } from "./auth/auth.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ── CORS ──────────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// ── BetterAuth handler ───────────────────────────────
// Must be mounted BEFORE express.json() to avoid conflicts
app.all("/api/auth/*splat", toNodeHandler(auth));

// ── Body parser ──────────────────────────────────────
app.use(express.json());

// ── Health check ─────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "ASETI-TIK API is running.",
    timestamp: new Date().toISOString(),
  });
});

// ── Domain API routes ────────────────────────────────
app.use("/api", apiRoutes);

// ── Global error handler ─────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
  ┌───────────────────────────────────────────┐
  │                                           │
  │   ASETI-TIK API Server                    │
  │   Running on: http://localhost:${env.PORT}      │
  │   Auth:       /api/auth/*                 │
  │   API:        /api/*                      │
  │   Health:     /api/health                 │
  │                                           │
  └───────────────────────────────────────────┘
  `);
});

export default app;
