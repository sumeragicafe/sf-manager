import { AnimalVaccine } from '@infra/sequelize/models/AnimalVaccine.model';
import { AnimalVaccineProps } from '@domain/entities/AnimalVaccine';
import { PaginatedResult, PaginationOptions } from '@types/Pagination';
import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';

export class SequelizeAnimalVaccineRepository implements IAnimalVaccineRepository {
  async findById(id: string): Promise<AnimalVaccineProps | null> {
    const av = await AnimalVaccine.findByPk(id);
    return av ? (av.toJSON() as AnimalVaccineProps) : null;
  }

  async create(data: Omit<AnimalVaccineProps, 'id'>): Promise<AnimalVaccineProps> {
    const av = await AnimalVaccine.create(data);
    return av.toJSON() as AnimalVaccineProps;
  }

  async update(id: string, data: Partial<Omit<AnimalVaccineProps, 'id'>>): Promise<AnimalVaccineProps | null> {
    const av = await AnimalVaccine.findByPk(id);
    if (!av) return null;
    await av.update(data);
    return av.toJSON() as AnimalVaccineProps;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AnimalVaccine.destroy({ where: { id } });
    return deleted > 0;
  }

  async findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalVaccineProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await AnimalVaccine.findAndCountAll({
      where: { petId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['applicationDate', 'DESC']]
    });
    return { items: rows.map(av => av.toJSON() as AnimalVaccineProps), total: count, page, pageSize };
  }
}