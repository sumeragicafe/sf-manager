import { AnimalMedia } from '@infra/sequelize/models/AnimalMedia.model';
import { IAnimalMediaRepository, AnimalMediaProps, PaginationOptions, PaginatedResult } from '@domain/repositories/IAnimalMediaRepository';

export class SequelizeAnimalMediaRepository implements IAnimalMediaRepository {
  async findById(id: string): Promise<AnimalMediaProps | null> {
    const am = await AnimalMedia.findByPk(id);
    return am ? (am.toJSON() as AnimalMediaProps) : null;
  }

  async create(data: Omit<AnimalMediaProps, 'id'>): Promise<AnimalMediaProps> {
    const am = await AnimalMedia.create(data);
    return am.toJSON() as AnimalMediaProps;
  }

  async update(id: string, data: Partial<Omit<AnimalMediaProps, 'id'>>): Promise<AnimalMediaProps | null> {
    const am = await AnimalMedia.findByPk(id);
    if (!am) return null;
    await am.update(data);
    return am.toJSON() as AnimalMediaProps;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AnimalMedia.destroy({ where: { id } });
    return deleted > 0;
  }

  async findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalMediaProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await AnimalMedia.findAndCountAll({
      where: { petId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['type', 'ASC']]
    });
    return { items: rows.map(am => am.toJSON() as AnimalMediaProps), total: count, page, pageSize };
  }
}