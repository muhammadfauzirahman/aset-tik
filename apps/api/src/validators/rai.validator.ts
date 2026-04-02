import { z } from "zod";

export const createRaiSchema = z.object({
  kodeRai: z.string().min(1, "Kode RAI wajib diisi."),
  namaPusat: z.string().min(1, "Nama pusat wajib diisi."),
});

export const updateRaiSchema = createRaiSchema.partial();

export type CreateRaiInput = z.infer<typeof createRaiSchema>;
export type UpdateRaiInput = z.infer<typeof updateRaiSchema>;
