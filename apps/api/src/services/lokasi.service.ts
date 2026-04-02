import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../middleware/errorHandler.js";
import type {
  CreateLokasiInput,
  UpdateLokasiInput,
} from "../validators/lokasi.validator.js";

export class LokasiService {
  async findAll() {
    return prisma.lokasi.findMany({ orderBy: { namaLokasi: "asc" } });
  }

  async findById(id: number) {
    const lokasi = await prisma.lokasi.findUnique({ where: { id } });
    if (!lokasi) throw new NotFoundError("Lokasi tidak ditemukan.");
    return lokasi;
  }

  async create(data: CreateLokasiInput) {
    return prisma.lokasi.create({ data });
  }

  async update(id: number, data: UpdateLokasiInput) {
    await this.findById(id);
    return prisma.lokasi.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return prisma.lokasi.delete({ where: { id } });
  }
}

export const lokasiService = new LokasiService();
