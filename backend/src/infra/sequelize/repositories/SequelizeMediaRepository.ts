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
    pagination?: PaginationOptions & {
      search?: string
      type?: 'image' | 'video' | 'document' | 'all'
      dateFrom?: Date
      dateTo?: Date
    },
    canViewPrivate = false
  ): Promise<PaginatedResult<MediaProps>> {
    const { page = 1, pageSize = 10, search, type, dateFrom, dateTo } = pagination || {}
    
    const where: any = {}
    if (!canViewPrivate) where.isPublic = true

    // Pesquisa por nome
    if (search) {
      where.fileName = { [Op.like]: `%${search}%` }
    }

    // Tipo
    if (type && type !== 'all') {
      if (type === 'document') {
        where.mimeType = { [Op.notLike]: 'image/%' }
        where.mimeType = { [Op.notLike]: 'video/%' }
      } else {
        where.mimeType = { [Op.like]: `${type}/%` }
      }
    }

    // Intervalo de datas
    if (dateFrom || dateTo) {
      where.uploadDate = {}
      if (dateFrom) where.uploadDate[Op.gte] = dateFrom
      if (dateTo) where.uploadDate[Op.lte] = dateTo
    }

    const { rows, count } = await Media.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['uploadDate', 'DESC']],
      attributes: ['id', 'fileName', 'mimeType', 'uploadDate'],
      where
    })

    return {
      items: rows.map(m => m.toJSON() as MediaProps),
      total: count,
      page,
      pageSize
    }
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