import { Router } from "express";
import fasilitasRoutes from "./fasilitas.routes.js";
import raiRoutes from "./rai.routes.js";
import instansiRoutes from "./instansi.routes.js";
import lokasiRoutes from "./lokasi.routes.js";

// Import Factory and Services for new Unified Structure
import { createCrudRouter } from "./generic.routes.js";
import { perangkatKerasService, layananDigitalService, konektivitasService } from "../services/generic.service.js";
import { 
  createPerangkatKerasSchema, updatePerangkatKerasSchema,
  createLayananDigitalSchema, updateLayananDigitalSchema,
  createKonektivitasSchema, updateKonektivitasSchema
} from "../validators/generic.validator.js";

const router = Router();

// Existing Routes
router.use("/fasilitas-komputasi", fasilitasRoutes);
router.use("/rai", raiRoutes);
router.use("/instansi", instansiRoutes);
router.use("/lokasi", lokasiRoutes);

// --- New Auto-Generated Unified Infrastruktur Routes ---
// Kategori RBAC kita map ke 'fasilitas' sementara waktu untuk permissions
router.use("/perangkat-keras", createCrudRouter({
  service: perangkatKerasService,
  createSchema: createPerangkatKerasSchema,
  updateSchema: updatePerangkatKerasSchema,
  resourceName: "fasilitas" 
}));

router.use("/layanan-digital", createCrudRouter({
  service: layananDigitalService,
  createSchema: createLayananDigitalSchema,
  updateSchema: updateLayananDigitalSchema,
  resourceName: "fasilitas"
}));

router.use("/konektivitas", createCrudRouter({
  service: konektivitasService,
  createSchema: createKonektivitasSchema,
  updateSchema: updateKonektivitasSchema,
  resourceName: "fasilitas"
}));

export default router;
