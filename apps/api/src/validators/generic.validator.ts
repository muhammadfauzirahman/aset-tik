import { z } from "zod";

// Base Schema untuk semua Aset
const baseAssetSchema = z.object({
  kodeAset: z.string().min(1, "Kode Aset wajib diisi."),
  deskripsi: z.string().default(""),
  pemilik: z.string().min(1, "Pemilik wajib diisi."),
});

// Validator Perangkat Keras
export const createPerangkatKerasSchema = baseAssetSchema.extend({
  kategori: z.enum(["SERVER", "JARINGAN", "KEAMANAN", "PENYIMPANAN", "PERIFERAL"]),
  namaPerangkat: z.string().min(1, "Nama Perangkat wajib diisi."),
  unitPengelola: z.string().min(1, "Unit Pengelola wajib diisi."),
  statusKepemilikan: z.string().min(1, "Status Kepemilikan wajib diisi."),
  
  // Spesial / Nullable spesifikasi
  kapasitasMemori: z.string().nullable().optional(),
  kapasitasPenyimpanan: z.string().nullable().optional(),
  teknologiProsesor: z.string().nullable().optional(),
  teknikPenyimpanan: z.string().nullable().optional(),
  tipePerangkat: z.string().nullable().optional(),
  metodeAkses: z.string().nullable().optional(),
  lokasiPenempatan: z.string().nullable().optional(),
  
  fasilitasId: z.number().int().positive().nullable().optional(),
  instansiId: z.number().int().positive().nullable().optional(),
});

export const updatePerangkatKerasSchema = createPerangkatKerasSchema.partial();

// Validator Layanan Digital
export const createLayananDigitalSchema = baseAssetSchema.extend({
  kategori: z.enum(["CLOUD", "PLATFORM", "SOFTWARE"]),
  namaLayanan: z.string().min(1, "Nama Layanan wajib diisi."),
  pengelola: z.string().min(1, "Pengelola wajib diisi."),
  statusKepemilikan: z.string().min(1, "Status Kepemilikan wajib diisi."),
  
  biayaLayanan: z.number().nullable().optional(),
  jangkaWaktu: z.string().nullable().optional(),
  jenisLisensi: z.string().nullable().optional(),
  validitasLisensi: z.string().nullable().optional(),
  tipeSoftware: z.string().nullable().optional(),

  fasilitasId: z.number().int().positive().nullable().optional(),
});

export const updateLayananDigitalSchema = createLayananDigitalSchema.partial();

// Validator Konektivitas
export const createKonektivitasSchema = baseAssetSchema.extend({
  kategori: z.enum(["Jaringan Intra", "SPLP"]),
  namaJaringan: z.string().min(1, "Nama Jaringan wajib diisi."),
  statusKepemilikan: z.string().min(1, "Status Kepemilikan wajib diisi."),
  
  jenisJaringan: z.string().nullable().optional(),
  bandwidth: z.number().int().nonnegative().nullable().optional(),
  tipeMedia: z.string().nullable().optional(),

  fasilitasId: z.number().int().positive().nullable().optional(),
});

export const updateKonektivitasSchema = createKonektivitasSchema.partial();
