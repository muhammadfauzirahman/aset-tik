import { z } from "zod";

const baseFasilitasSchema = z.object({
  kodeFasilitas: z.string().min(1, "Kode fasilitas wajib diisi."),
  namaFasilitas: z.string().min(1, "Nama fasilitas wajib diisi."),
  jenisFasilitas: z.enum(["Pusat Data", "Pusat Komputasi", "Pusat Kendali"], {
    errorMap: () => ({ message: "Jenis harus: Pusat Data, Pusat Komputasi, atau Pusat Kendali." }),
  }),
  bandwidthIntranet: z.number().int().min(0).default(0),
  bandwidthInternet: z.number().int().min(0).default(0),
  lokasiFisik: z.string().min(1, "Lokasi fisik wajib diisi."),
  klasifikasiTier: z
    .enum(["Tier 3", "Tier 4", "Non-Tier"])
    .nullable()
    .optional()
    .default(null),
  kepemilikan: z.enum(["Sendiri", "BUMN", "Pihak Ketiga", "Swasta"], {
    errorMap: () => ({ message: "Kepemilikan harus: Sendiri, BUMN, Pihak Ketiga, atau Swasta." }),
  }),
  sistemPengamanan: z.string().default(""),
  instansiId: z.number().int().positive("Instansi wajib dipilih."),
  status: z
    .enum(["Aktif", "Non-Aktif", "Perbaikan"])
    .default("Aktif"),
});

export const createFasilitasSchema = baseFasilitasSchema
  .refine(
    (data) => {
      if (data.jenisFasilitas === "Pusat Data") {
        return data.klasifikasiTier !== null && data.klasifikasiTier !== "Non-Tier";
      }
      return true;
    },
    {
      message: "Klasifikasi Tier wajib diisi untuk Pusat Data (minimal Tier 3).",
      path: ["klasifikasiTier"],
    }
  )
  .refine(
    (data) => {
      if (data.kepemilikan !== "Sendiri") {
        return data.lokasiFisik.trim().length > 0;
      }
      return true;
    },
    {
      message: "Lokasi fisik/vendor wajib diisi jika kepemilikan bukan Sendiri.",
      path: ["lokasiFisik"],
    }
  );

export const updateFasilitasSchema = baseFasilitasSchema.partial();

export type CreateFasilitasInput = z.infer<typeof createFasilitasSchema>;
export type UpdateFasilitasInput = z.infer<typeof updateFasilitasSchema>;
