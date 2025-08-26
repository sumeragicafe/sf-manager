import { Vaccine } from '@infra/sequelize/models/Vaccine.model';
import { VaccineProps } from '@domain/entities/Vaccine';
import { PaginatedResult, PaginationOptions } from '@types/Pagination';
import { IVaccineRepository} from '@domain/repositories/IVaccineRepository';
import { Op } from 'sequelize';

export class SequelizeVaccineRepository implements IVaccineRepository {
  async findById(id: number): Promise<VaccineProps | null> {
    const vaccine = await Vaccine.findByPk(id);
    return vaccine ? (vaccine.toJSON() as VaccineProps) : null;
  }

  async searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<VaccineProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await Vaccine.findAndCountAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return { items: rows.map(v => v.toJSON() as VaccineProps), total: count, page, pageSize };
  }

  async create(data: Omit<VaccineProps, 'id'>): Promise<VaccineProps> {
    const vaccine = await Vaccine.create(data);
    return vaccine.toJSON() as VaccineProps;
  }

  async update(id: number, data: Partial<Omit<VaccineProps, 'id'>>): Promise<VaccineProps | null> {
    const vaccine = await Vaccine.findByPk(id);
    if (!vaccine) return null;
    await vaccine.update(data);
    return vaccine.toJSON() as VaccineProps;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Vaccine.destroy({ where: { id } });
    return deleted > 0;
  }

  async findAll(pagination?: PaginationOptions): Promise<PaginatedResult<VaccineProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await Vaccine.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['name', 'ASC']]
    });
    return { items: rows.map(v => v.toJSON() as VaccineProps), total: count, page, pageSize };
  }
}