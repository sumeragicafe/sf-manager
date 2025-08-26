import { SpeciesProps } from '@domain/entities/Species';
import { Species } from '@infra/sequelize/models/Species.model';
import { Op } from 'sequelize';
import { ISpeciesRepository} from '@domain/repositories/ISpeciesRepository';
import { PaginatedResult, PaginationOptions } from '@types/Pagination';

export class SequelizeSpeciesRepository implements ISpeciesRepository {
  async findById(id: number): Promise<SpeciesProps | null> {
    const species = await Species.findByPk(id);
    return species ? (species.toJSON() as SpeciesProps) : null;
  }

  async searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<SpeciesProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await Species.findAndCountAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return { items: rows.map(s => s.toJSON() as SpeciesProps), total: count, page, pageSize };
  }

  async create(data: Omit<SpeciesProps, 'id'>): Promise<SpeciesProps> {
    const species = await Species.create(data);
    return species.toJSON() as SpeciesProps;
  }

  async update(id: number, data: Partial<Omit<SpeciesProps, 'id'>>): Promise<SpeciesProps | null> {
    const species = await Species.findByPk(id);
    if (!species) return null;
    await species.update(data);
    return species.toJSON() as SpeciesProps;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Species.destroy({ where: { id } });
    return deleted > 0;
  }
}