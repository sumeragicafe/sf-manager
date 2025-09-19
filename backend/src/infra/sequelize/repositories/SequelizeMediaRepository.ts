import { Op } from 'sequelize' 
import { Media } from '@infra/sequelize/models/Media.model';
import { MediaProps } from '@domain/entities/Media';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';
import { IMediaRepository} from '@domain/repositories/IMediaRepository';

export class SequelizeMediaRepository implements IMediaRepository {
  async findById(id: string, canViewPrivate = false): Promise<MediaProps | null> {
    const where = canViewPrivate ? { id } : { id, isPublic: true };

    const media = await Media.findOne({ where });
    return media ? (media.toJSON() as MediaProps) : null;
  }

  async create(data: Omit<MediaProps, 'id'>): Promise<MediaProps> {
    const media = await Media.create(data);
    return media.toJSON() as MediaProps;
  }

  async update(id: string, data: Partial<Omit<MediaProps, 'id'>>): Promise<MediaProps | null> {
    const media = await Media.findByPk(id);
    if (!media) return null;
    await media.update(data);
    return media.toJSON() as MediaProps;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Media.destroy({ where: { id } });
    return deleted > 0;
  }

async findAll(
  pagination?: PaginationOptions,
  canViewPrivate = false
): Promise<PaginatedResult<MediaProps>> {
  const {
    page = 1,
    pageSize = 10,
    filters = {},
    sortBy = 'uploadDate',
    sortOrder = 'desc'
  } = pagination || {};

  const where: any = {};

  // Só mostra públicas se não tiver permissão
  if (!canViewPrivate || filters.isPublic === true) {
    where.isPublic = true;
  } else if (filters.isPublic === false && canViewPrivate) {
    where.isPublic = false;
  }

  // Pesquisa por nome
  if (filters.search) {
    where.fileName = { [Op.like]: `%${filters.search}%` };
  }

  // Tipo
  if (filters.type && filters.type !== 'all') {
    if (filters.type === 'document') {
      where.mimeType = {
        [Op.and]: [
          { [Op.notLike]: 'image/%' },
          { [Op.notLike]: 'video/%' }
        ]
      };
    } else {
      where.mimeType = { [Op.like]: `${filters.type}/%` };
    }
  }

  // Intervalo de datas
  if (filters.dateFrom || filters.dateTo) {
    where.uploadDate = {};
    if (filters.dateFrom) where.uploadDate[Op.gte] = filters.dateFrom;
    if (filters.dateTo) where.uploadDate[Op.lte] = filters.dateTo;
  }

  // Outros filtros genéricos
  for (const key of Object.keys(filters)) {
    if (!['isPublic', 'search', 'type', 'dateFrom', 'dateTo'].includes(key)) {
      where[key] = filters[key];
    }
  }

  const { rows, count } = await Media.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: [[sortBy, sortOrder.toUpperCase()]],
    attributes: ['id', 'fileName', 'mimeType', 'uploadDate', 'isPublic'],
    where
  });

  return {
    items: rows.map(m => m.toJSON() as MediaProps),
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
    hasNext: page * pageSize < count,
    hasPrevious: page > 1,
    appliedFilters: filters,
    sortBy,
    sortOrder
  };
}


  async saveFile(file: { buffer: Buffer; fileName: string; mimeType: string }): Promise<MediaProps> {
    const fixedName = Buffer.from(file.fileName, 'latin1').toString('utf8');

    const media = await Media.create({
      fileName: fixedName,
      mimeType: file.mimeType,
      data: file.buffer,
      uploadDate: new Date()
    });
    return media.toJSON() as MediaProps;
  }
}