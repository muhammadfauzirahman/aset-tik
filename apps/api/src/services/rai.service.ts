import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../middleware/errorHandler.js";
import type { CreateRaiInput, UpdateRaiInput } from "../validators/rai.validator.js";

export class RaiService {
  async findAll() {
    return prisma.rai.findMany({ orderBy: { kodeRai: "asc" } });
  }

  async findById(id: number) {
    const rai = await prisma.rai.findUnique({ where: { id } });
    if (!rai) throw new NotFoundError("Referensi RAI tidak ditemukan.");
    return rai;
  }

  async create(data: CreateRaiInput) {
    return prisma.rai.create({ data });
  }

  async update(id: number, data: UpdateRaiInput) {
    await this.findById(id);
    return prisma.rai.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return prisma.rai.delete({ where: { id } });
  }
}

export const raiService = new RaiService();
