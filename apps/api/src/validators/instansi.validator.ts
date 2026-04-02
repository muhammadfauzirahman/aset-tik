import { z } from "zod";

export const createInstansiSchema = z.object({
  namaInstansi: z.string().min(1, "Nama instansi wajib diisi."),
  singkatan: z.string().min(1, "Singkatan wajib diisi."),
});

export const updateInstansiSchema = createInstansiSchema.partial();

export type CreateInstansiInput = z.infer<typeof createInstansiSchema>;
export type UpdateInstansiInput = z.infer<typeof updateInstansiSchema>;
