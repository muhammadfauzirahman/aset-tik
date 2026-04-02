import { z } from "zod";

export const createLokasiSchema = z.object({
  namaLokasi: z.string().min(1, "Nama lokasi wajib diisi."),
  tipeLokasi: z.enum(
    ["Pusat Data", "Command Center", "Sirkuit/Jaringan", "Vendor Cloud"],
    {
      errorMap: () => ({
        message:
          "Tipe harus: Pusat Data, Command Center, Sirkuit/Jaringan, atau Vendor Cloud.",
      }),
    }
  ),
  alamat: z.string().min(1, "Alamat wajib diisi."),
});

export const updateLokasiSchema = createLokasiSchema.partial();

export type CreateLokasiInput = z.infer<typeof createLokasiSchema>;
export type UpdateLokasiInput = z.infer<typeof updateLokasiSchema>;
