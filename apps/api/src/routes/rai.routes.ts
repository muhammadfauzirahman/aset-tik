import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createRaiSchema, updateRaiSchema } from "../validators/rai.validator.js";
import { raiService } from "../services/rai.service.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("masterData", "read"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await raiService.findAll();
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
      const data = await raiService.findById(parseInt(req.params.id, 10));
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
  validate(createRaiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await raiService.create(req.body);
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
  validate(updateRaiSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await raiService.update(parseInt(req.params.id, 10), req.body);
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
      await raiService.delete(parseInt(req.params.id, 10));
      res.json({ success: true, message: "Referensi RAI berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
