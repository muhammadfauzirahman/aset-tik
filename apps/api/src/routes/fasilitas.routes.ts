import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createFasilitasSchema,
  updateFasilitasSchema,
} from "../validators/fasilitas.validator.js";
import { fasilitasService } from "../services/fasilitas.service.js";

const router = Router();

/**
 * GET /api/fasilitas-komputasi
 * List all fasilitas with optional filters.
 * Query: ?jenis=Pusat Data&status=Aktif&instansiId=1
 */
router.get(
  "/",
  authenticate,
  authorize("fasilitas", "read"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        jenisFasilitas: req.query.jenis as string | undefined,
        status: req.query.status as string | undefined,
        instansiId: req.query.instansiId
          ? parseInt(req.query.instansiId as string, 10)
          : undefined,
      };

      const result = await fasilitasService.findAll(filters);

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/fasilitas-komputasi/:id
 * Get a single fasilitas by ID.
 */
router.get(
  "/:id",
  authenticate,
  authorize("fasilitas", "read"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await fasilitasService.findById(id);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/fasilitas-komputasi
 * Create a new fasilitas.
 */
router.post(
  "/",
  authenticate,
  authorize("fasilitas", "create"),
  validate(createFasilitasSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fasilitasService.create(req.body);

      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/fasilitas-komputasi/:id
 * Update an existing fasilitas.
 */
router.put(
  "/:id",
  authenticate,
  authorize("fasilitas", "update"),
  validate(updateFasilitasSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await fasilitasService.update(id, req.body);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/fasilitas-komputasi/:id
 * Delete a fasilitas (admin only, cascade restrict).
 */
router.delete(
  "/:id",
  authenticate,
  authorize("fasilitas", "delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await fasilitasService.delete(id);

      res.json({
        success: true,
        message: "Fasilitas komputasi berhasil dihapus.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
