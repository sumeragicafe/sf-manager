import { Op } from 'sequelize';
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

  async findByPet(
    petId: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<AnimalFactProps>> {
    const {
      page = 1,
      pageSize = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = pagination || {};

    const where: any = { petId };

    if (filters.search) {
      const searchTerm = `%${filters.search}%`;

      where[Op.or] = [
        { text: { [Op.like]: searchTerm } },
        { id: { [Op.like]: searchTerm } },
        { createdAt: { [Op.like]: searchTerm } }, 
      ];
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = { ...(where.createdAt || {}) };
      if (filters.dateFrom) {
        where.createdAt[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Outros filtros genéricos
    for (const key of Object.keys(filters)) {
      if (!['search', 'dateFrom', 'dateTo'].includes(key)) {
        where[key] = filters[key];
      }
    }

    const { rows, count } = await AnimalFact.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return {
      items: rows.map((f) => f.toJSON() as AnimalFactProps),
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      hasNext: page * pageSize < count,
      hasPrevious: page > 1,
      appliedFilters: filters,
      sortBy,
      sortOrder,
    };
  }
}