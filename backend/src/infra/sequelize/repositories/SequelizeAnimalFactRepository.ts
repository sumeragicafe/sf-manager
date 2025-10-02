import { AnimalFact } from '@infra/sequelize/models/AnimalFact.model';
import { AnimalFactProps } from '@domain/entities/AnimalFact';
import { PaginatedResult, PaginationOptions } from '@types/Pagination';
import { IAnimalFactRepository } from '@domain/repositories/IAnimalFactRepository';

export class SequelizeAnimalFactRepository implements IAnimalFactRepository {
  async findById(id: string): Promise<AnimalFactProps | null> {
    const fact = await AnimalFact.findByPk(id);
    return fact ? (fact.toJSON() as AnimalFactProps) : null;
  }

  async create(data: Omit<AnimalFactProps, 'id'>): Promise<AnimalFactProps> {
    const fact = await AnimalFact.create(data);
    return fact.toJSON() as AnimalFactProps;
  }

  async update(factId: string, data: Partial<Omit<AnimalFactProps, 'id'>>): Promise<AnimalFactProps | null> {
    const fact = await AnimalFact.findByPk(factId);
    if (!fact) return null;
    await fact.update(data);
    return fact.toJSON() as AnimalFactProps;
  }

  async delete(factId: string): Promise<boolean> {
    const deleted = await AnimalFact.destroy({ where: { id: factId } });
    return deleted > 0;
  }

  async findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalFactProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await AnimalFact.findAndCountAll({
      where: { petId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    });
    return { items: rows.map(f => f.toJSON() as AnimalFactProps), total: count, page, pageSize };
  }
}