import { Op } from 'sequelize';
import { AnimalMedia } from '@infra/sequelize/models/AnimalMedia.model';
import { Media } from '@infra/sequelize/models/Media.model';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';
import { IAnimalMediaRepository, AnimalMediaProps} from '@domain/repositories/IAnimalMediaRepository';

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
  async findByPet(
    petId: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<AnimalMediaProps>> {
    const {
      page = 1,
      pageSize = 10,
      filters = {},
      sortBy = 'uploadDate',
      sortOrder = 'desc'
    } = pagination || {};

    if (!petId) throw new Error('petId é obrigatório');

    const mediaWhere: any = {};

    // isPublic / permissões
    if (filters.isPublic !== undefined) {
      mediaWhere.isPublic = filters.isPublic;
    }

    // Filtros padronizados dentro de filters
    if (filters.search) {
      mediaWhere.fileName = { [Op.like]: `%${filters.search}%` };
    }

    if (filters.type && filters.type !== 'all') {
      if (filters.type === 'document') {
        mediaWhere.mimeType = {
          [Op.and]: [
            { [Op.notLike]: 'image/%' },
            { [Op.notLike]: 'video/%' }
          ]
        };
      } else {
        mediaWhere.mimeType = { [Op.like]: `${filters.type}/%` };
      }
    }

    if (filters.dateFrom || filters.dateTo) {
      mediaWhere.uploadDate = {};
      if (filters.dateFrom) mediaWhere.uploadDate[Op.gte] = filters.dateFrom;
      if (filters.dateTo) mediaWhere.uploadDate[Op.lte] = filters.dateTo;
    }

    // Outros filtros genéricos
    for (const key of Object.keys(filters)) {
      if (!['isPublic', 'search', 'type', 'dateFrom', 'dateTo'].includes(key)) {
        mediaWhere[key] = filters[key];
      }
    }

    const { rows, count } = await AnimalMedia.findAndCountAll({
      where: { petId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[{ model: Media, as: 'media' }, sortBy, sortOrder.toUpperCase()]],
      attributes: ['id', 'type'],
      include: [
        {
          model: Media,
          as: 'media',
          attributes: ['id', 'fileName', 'mimeType', 'isPublic', 'uploadDate'],
          where: mediaWhere
        }
      ]
    });

    return {
      items: rows.map(am => am.toJSON() as AnimalMediaProps),
      total: count,
      page,
      pageSize,
      appliedFilters: filters,
      sortBy,
      sortOrder
    };
  }



}