import { prisma } from "../lib/prisma.js";
import {
  NotFoundError,
  RestrictViolationError,
  ConflictError,
} from "../middleware/errorHandler.js";
import type {
  CreateFasilitasInput,
  UpdateFasilitasInput,
} from "../validators/fasilitas.validator.js";

interface FasilitasFilters {
  jenisFasilitas?: string;
  status?: string;
  instansiId?: number;
}

export class FasilitasService {
  /**
   * List all fasilitas with optional filters.
   * Includes instansi relation for display.
   */
  async findAll(filters?: FasilitasFilters) {
    const where: Record<string, unknown> = {};

    if (filters?.jenisFasilitas) {
      where.jenisFasilitas = filters.jenisFasilitas;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.instansiId) {
      where.instansiId = filters.instansiId;
    }

    const data = await prisma.fasilitasKomputasi.findMany({
      where,
      include: {
        instansi: {
          select: {
            id: true,
            namaInstansi: true,
            singkatan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.fasilitasKomputasi.count();
    const filtered = await prisma.fasilitasKomputasi.count({ where });

    return { data, meta: { total, filtered } };
  }

  /**
   * Find a single fasilitas by ID with instansi relation.
   */
  async findById(id: number) {
    const fasilitas = await prisma.fasilitasKomputasi.findUnique({
      where: { id },
      include: {
        instansi: {
          select: {
            id: true,
            namaInstansi: true,
            singkatan: true,
          },
        },
      },
    });

    if (!fasilitas) {
      throw new NotFoundError("Fasilitas komputasi tidak ditemukan.");
    }

    return fasilitas;
  }

  /**
   * Create a new fasilitas.
   * Validates that the instansi exists.
   */
  async create(data: CreateFasilitasInput) {
    // Verify instansi exists
    const instansi = await prisma.instansi.findUnique({
      where: { id: data.instansiId },
    });

    if (!instansi) {
      throw new NotFoundError(
        `Instansi dengan ID ${data.instansiId} tidak ditemukan.`
      );
    }

    // Check unique kodeFasilitas
    const existing = await prisma.fasilitasKomputasi.findUnique({
      where: { kodeFasilitas: data.kodeFasilitas },
    });

    if (existing) {
      throw new ConflictError(
        `Kode fasilitas "${data.kodeFasilitas}" sudah digunakan.`
      );
    }

    // Nullify tier for non-Pusat Data
    const finalData = {
      ...data,
      klasifikasiTier:
        data.jenisFasilitas === "Pusat Data" ? data.klasifikasiTier : null,
    };

    return prisma.fasilitasKomputasi.create({
      data: finalData,
      include: {
        instansi: {
          select: {
            id: true,
            namaInstansi: true,
            singkatan: true,
          },
        },
      },
    });
  }

  /**
   * Update an existing fasilitas.
   */
  async update(id: number, data: UpdateFasilitasInput) {
    // Verify fasilitas exists
    const existing = await prisma.fasilitasKomputasi.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Fasilitas komputasi tidak ditemukan.");
    }

    // If instansiId is being changed, verify it exists
    if (data.instansiId) {
      const instansi = await prisma.instansi.findUnique({
        where: { id: data.instansiId },
      });
      if (!instansi) {
        throw new NotFoundError(
          `Instansi dengan ID ${data.instansiId} tidak ditemukan.`
        );
      }
    }

    // If kodeFasilitas is being changed, check uniqueness
    if (data.kodeFasilitas && data.kodeFasilitas !== existing.kodeFasilitas) {
      const conflict = await prisma.fasilitasKomputasi.findUnique({
        where: { kodeFasilitas: data.kodeFasilitas },
      });
      if (conflict) {
        throw new ConflictError(
          `Kode fasilitas "${data.kodeFasilitas}" sudah digunakan.`
        );
      }
    }

    // Determine jenis for tier logic
    const jenis = data.jenisFasilitas || existing.jenisFasilitas;
    const updateData = {
      ...data,
      klasifikasiTier:
        jenis === "Pusat Data"
          ? data.klasifikasiTier !== undefined
            ? data.klasifikasiTier
            : existing.klasifikasiTier
          : null,
    };

    return prisma.fasilitasKomputasi.update({
      where: { id },
      data: updateData,
      include: {
        instansi: {
          select: {
            id: true,
            namaInstansi: true,
            singkatan: true,
          },
        },
      },
    });
  }

  /**
   * Delete a fasilitas.
   * Implements CASCADE RESTRICT — cannot delete if child assets exist.
   * (Future: check Server, Jaringan, Keamanan relations)
   */
  async delete(id: number) {
    const fasilitas = await prisma.fasilitasKomputasi.findUnique({
      where: { id },
    });

    if (!fasilitas) {
      throw new NotFoundError("Fasilitas komputasi tidak ditemukan.");
    }

    // Future: When child models exist, check them here:
    // const childCount = await prisma.server.count({ where: { fasilitasId: id } });
    // if (childCount > 0) {
    //   throw new RestrictViolationError(
    //     `Fasilitas tidak dapat dihapus karena masih memiliki ${childCount} aset terikat.`
    //   );
    // }

    return prisma.fasilitasKomputasi.delete({ where: { id } });
  }
}

export const fasilitasService = new FasilitasService();
