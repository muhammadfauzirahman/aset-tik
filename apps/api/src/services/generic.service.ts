import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../middleware/errorHandler.js";

/**
 * Generic Service Factory untuk CRUD dinamis pada Prisma Model.
 * Menyediakan standardisasi untuk entitas Infrastruktur SPBE.
 */
export class GenericService<T> {
  constructor(private modelName: string) {}

  private get model() {
    return (prisma as any)[this.modelName];
  }

  async findAll(filters: Record<string, any> = {}) {
    // Membersihkan undefined filters
    const where = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const data = await this.model.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    
    const total = await this.model.count();
    const filtered = await this.model.count({ where });

    return { data, meta: { total, filtered } };
  }

  async findById(id: number) {
    const record = await this.model.findUnique({ where: { id } });
    if (!record) throw new NotFoundError(`Data ${this.modelName} tidak ditemukan.`);
    return record;
  }

  async create(data: Partial<T>) {
    return this.model.create({ data });
  }

  async update(id: number, data: Partial<T>) {
    await this.findById(id); // Check existence
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.model.delete({ where: { id } });
  }
}

// Instances for Unified Tables
export const perangkatKerasService = new GenericService("perangkatKeras");
export const layananDigitalService = new GenericService("layananDigital");
export const konektivitasService = new GenericService("konektivitas");
