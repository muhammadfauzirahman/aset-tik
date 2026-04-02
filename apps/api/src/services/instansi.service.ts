import { prisma } from "../lib/prisma.js";
import {
  NotFoundError,
  RestrictViolationError,
} from "../middleware/errorHandler.js";
import type {
  CreateInstansiInput,
  UpdateInstansiInput,
} from "../validators/instansi.validator.js";

export class InstansiService {
  async findAll() {
    return prisma.instansi.findMany({
      orderBy: { singkatan: "asc" },
      include: {
        _count: {
          select: { fasilitasKomputasi: true },
        },
      },
    });
  }

  async findById(id: number) {
    const instansi = await prisma.instansi.findUnique({
      where: { id },
      include: {
        _count: {
          select: { fasilitasKomputasi: true },
        },
      },
    });
    if (!instansi) throw new NotFoundError("Instansi tidak ditemukan.");
    return instansi;
  }

  async create(data: CreateInstansiInput) {
    return prisma.instansi.create({ data });
  }

  async update(id: number, data: UpdateInstansiInput) {
    await this.findById(id);
    return prisma.instansi.update({ where: { id }, data });
  }

  /**
   * Delete with RESTRICT — cannot delete if fasilitas are linked.
   */
  async delete(id: number) {
    const instansi = await this.findById(id);
    const childCount = instansi._count.fasilitasKomputasi;

    if (childCount > 0) {
      throw new RestrictViolationError(
        `Instansi "${instansi.singkatan}" tidak dapat dihapus karena masih memiliki ${childCount} fasilitas terkait. Pindahkan fasilitas terlebih dahulu.`
      );
    }

    return prisma.instansi.delete({ where: { id } });
  }
}

export const instansiService = new InstansiService();
