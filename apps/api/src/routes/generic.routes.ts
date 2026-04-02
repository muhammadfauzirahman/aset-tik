import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { GenericService } from "../services/generic.service.js";

interface CreateRouterParams<T> {
  service: GenericService<T>;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  resourceName: "fasilitas" | "masterData" | "laporan"; // Digunakan utk check RBAC
}

/**
 * Endpoint Factory untuk Generic CRUD operation.
 */
export function createCrudRouter<T>({
  service,
  createSchema,
  updateSchema,
  resourceName,
}: CreateRouterParams<T>): Router {
  const router = Router();

  // GET / -> Find All with Query Params Filter
  router.get(
    "/",
    authenticate,
    authorize(resourceName, "read"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filters = req.query; // Akan dibersihkan di tahap logic `generic service`
        const result = await service.findAll(filters);
        res.json({ success: true, ...result });
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /:id -> Find By ID
  router.get(
    "/:id",
    authenticate,
    authorize(resourceName, "read"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const data = await service.findById(id);
        res.json({ success: true, data });
      } catch (error) {
        next(error);
      }
    }
  );

  // POST / -> Create
  router.post(
    "/",
    authenticate,
    authorize(resourceName, "create"),
    validate(createSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.create(req.body);
        res.status(201).json({ success: true, data });
      } catch (error) {
        next(error);
      }
    }
  );

  // PUT /:id -> Update
  router.put(
    "/:id",
    authenticate,
    authorize(resourceName, "update"),
    validate(updateSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const data = await service.update(id, req.body);
        res.json({ success: true, data });
      } catch (error) {
        next(error);
      }
    }
  );

  // DELETE /:id -> Delete
  router.delete(
    "/:id",
    authenticate,
    authorize(resourceName, "delete"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        await service.delete(id);
        res.json({ success: true, message: "Data berhasil dihapus." });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
