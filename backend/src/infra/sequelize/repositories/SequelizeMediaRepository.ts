import { Media } from '@infra/sequelize/models/Media.model';
import { MediaProps } from '@domain/entities/Media';
import { PaginatedResult } from '@types/Pagination';
import { IMediaRepository} from '@domain/repositories/IMediaRepository';

export class SequelizeMediaRepository implements IMediaRepository {
  async findById(id: string): Promise<MediaProps | null> {
    const media = await Media.findByPk(id);
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

  async findAll(pagination?: PaginationOptions, canViewPrivate = false): Promise<PaginatedResult<MediaProps>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const where = canViewPrivate ? {} : {isPublic: true};

    const { rows, count } = await Media.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['uploadDate', 'DESC']],
      attributes: ['id', 'fileName', 'mimeType', 'uploadDate'],
      where
    });
    return { items: rows.map(m => m.toJSON() as MediaProps), total: count, page, pageSize };
  }

  async saveFile(file: { buffer: Buffer; fileName: string; mimeType: string }): Promise<MediaProps> {
    const media = await Media.create({
      fileName: file.fileName,
      mimeType: file.mimeType,
      data: file.buffer,
      uploadDate: new Date()
    });
    return media.toJSON() as MediaProps;
  }
}