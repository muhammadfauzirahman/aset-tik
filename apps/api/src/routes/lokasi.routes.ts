import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createLokasiSchema,
  updateLokasiSchema,
} from "../validators/lokasi.validator.js";
import { lokasiService } from "../services/lokasi.service.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("masterData", "read"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await lokasiService.findAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  authenticate,
  authorize("masterData", "read"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await lokasiService.findById(parseInt(req.params.id as string, 10));
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  authenticate,
  authorize("masterData", "create"),
  validate(createLokasiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await lokasiService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  authenticate,
  authorize("masterData", "update"),
  validate(updateLokasiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await lokasiService.update(
        parseInt(req.params.id as string, 10),
        req.body
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  authenticate,
  authorize("masterData", "update"),
  validate(updateLokasiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await lokasiService.update(
        parseInt(req.params.id as string, 10),
        req.body
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  authorize("masterData", "delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await lokasiService.delete(parseInt(req.params.id as string, 10));
      res.json({ success: true, message: "Lokasi berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
