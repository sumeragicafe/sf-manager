import { Op, fn, col, where, literal } from 'sequelize';
import { AnimalVaccine } from '@infra/sequelize/models/AnimalVaccine.model';
import { Vaccine } from '@infra/sequelize/models/Vaccine.model';
import { AnimalVaccineProps } from '@domain/entities/AnimalVaccine';
import { IAnimalVaccineRepository } from '@domain/repositories/IAnimalVaccineRepository';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export class SequelizeAnimalVaccineRepository implements IAnimalVaccineRepository {
  async findById(id: string): Promise<AnimalVaccineProps | null> {
    const record = await AnimalVaccine.findByPk(id);
    return record ? (record.toJSON() as AnimalVaccineProps) : null;
  }

  async findAll(
    petId: String,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<AnimalVaccineProps>> {
    const {
      page = 1,
      pageSize = 20,
      filters = {},
      sortBy = 'applicationDate',
      sortOrder = 'desc',
    } = pagination || {};

    const where: any = {};

    const searchConditions: any[] = [];
    if (filters.search) {
      const search = `%${filters.search}%`;

      searchConditions.push(
        { applicator: { [Op.like]: search } },    // campo da tabela principal
        { '$vaccine.name$': { [Op.like]: search } } // campo da associação
      );
    }

    // Filtro por petId
    if (petId) {
      where.petId = petId;
    }

    // Filtro por vaccineId
    if (filters.vaccineId) {
      where.vaccineId = filters.vaccineId;
    }

    // Intervalo de datas (applicationDate)
    if (filters.dateFrom || filters.dateTo) {
      where.applicationDate = {};
      if (filters.dateFrom) where.applicationDate[Op.gte] = filters.dateFrom;
      if (filters.dateTo) where.applicationDate[Op.lte] = filters.dateTo;
    }

    // Outros filtros genéricos
    for (const key of Object.keys(filters)) {
      if (!['search', 'petId', 'vaccineId', 'dateFrom', 'dateTo'].includes(key)) {
        where[key] = filters[key];
      }
    }

    const finalWhere = searchConditions.length
      ? { [Op.and]: [where, { [Op.or]: searchConditions }] }
      : where;


    const { rows, count } = await AnimalVaccine.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sortBy, sortOrder.toUpperCase()]],
      where: finalWhere,
      include: [
        {
          model: Vaccine,
          as: 'vaccine',
          attributes: ['id', 'name', 'description'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map(r => r.toJSON() as AnimalVaccineProps),
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


  async create(data: Omit<AnimalVaccineProps, 'id'>): Promise<AnimalVaccineProps> {
    const created = await AnimalVaccine.create(data as any);
    return created.toJSON() as AnimalVaccineProps;
  }

  async update(id: string, data: Partial<Omit<AnimalVaccineProps, 'id'>>): Promise<AnimalVaccineProps | null> {
    const record = await AnimalVaccine.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record.toJSON() as AnimalVaccineProps;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AnimalVaccine.destroy({ where: { id } });
    return deleted > 0;
  }
}
