import { Breed } from '@infra/sequelize/models/Breed.model';
import { BreedProps } from '@domain/entities/Breed';
import { PaginatedResult, PaginationOptions } from '@types/Pagination';
import { IBreedRepository} from '@domain/repositories/IBreedRepository';
import { Op } from 'sequelize';

export class SequelizeBreedRepository implements IBreedRepository {
  async findById(id: number): Promise<BreedProps | null> {
    const breed = await Breed.findByPk(id);
    return breed ? (breed.toJSON() as BreedProps) : null;
  }

  async searchByName(name?: string, pagination?: PaginationOptions): Promise<PaginatedResult<BreedProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    
    const where = name ? { name: { [Op.like]: `%${name}%` } } : undefined;

    const { rows, count } = await Breed.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return { items: rows.map(b => b.toJSON() as BreedProps), total: count, page, pageSize };
  }


  async create(data: Omit<BreedProps, 'id'>): Promise<BreedProps> {
    const breed = await Breed.create(data);
    return breed.toJSON() as BreedProps;
  }

  async update(id: number, data: Partial<Omit<BreedProps, 'id'>>): Promise<BreedProps | null> {
    const breed = await Breed.findByPk(id);
    if (!breed) return null;
    await breed.update(data);
    return breed.toJSON() as BreedProps;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Breed.destroy({ where: { id } });
    return deleted > 0;
  }

  async findBySpecies(speciesId?: number, search?: string, pagination?: PaginationOptions): Promise<PaginatedResult<BreedProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};

    const where: any = {};

    if (speciesId) {
      where.speciesId = speciesId;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await Breed.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return { items: rows.map(b => b.toJSON() as BreedProps), total: count, page, pageSize };
  }

}