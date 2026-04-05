import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createInstansiSchema,
  updateInstansiSchema,
} from "../validators/instansi.validator.js";
import { instansiService } from "../services/instansi.service.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("masterData", "read"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await instansiService.findAll();
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
      const data = await instansiService.findById(parseInt(req.params.id as string, 10));
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
  validate(createInstansiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await instansiService.create(req.body);
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
  validate(updateInstansiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await instansiService.update(
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
  validate(updateInstansiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await instansiService.update(
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
      await instansiService.delete(parseInt(req.params.id as string, 10));
      res.json({ success: true, message: "Instansi berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
