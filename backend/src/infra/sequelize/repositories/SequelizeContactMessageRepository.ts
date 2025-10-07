import { ContactMessage } from '@domain/entities/ContactMessage';
import { IContactMessageRepository, ContactMessageFilters } from '@domain/repositories/IContactMessageRepository';
import type { PaginatedResult, PaginationOptions } from '../../../types/Pagination';
import { ContactMessageModel } from '@infra/sequelize/models/ContactMessage.model';
import { Op } from 'sequelize';

export class SequelizeContactMessageRepository implements IContactMessageRepository {
  async create(message: ContactMessage): Promise<ContactMessage> {
    const data = message.toPersistence();
    const created = await ContactMessageModel.create({
      subject: data.subject,
      email: data.email,
      name: data.name,
      message: data.message,
      acceptPolicy: data.acceptPolicy,
      allowContact: data.allowContact ?? false,
      read: data.read ?? false
    } as any);
    return new ContactMessage({
      id: (created as any).id,
      subject: (created as any).subject,
      email: (created as any).email,
      name: (created as any).name,
      message: (created as any).message,
      acceptPolicy: (created as any).acceptPolicy,
      allowContact: (created as any).allowContact,
      read: (created as any).read,
      createdAt: (created as any).createdAt,
      updatedAt: (created as any).updatedAt
    });
  }

  async list(options: PaginationOptions, filters?: ContactMessageFilters): Promise<PaginatedResult<ContactMessage>> {
    const { page, pageSize } = options;
    const where: any = {};

    if (typeof filters?.read === 'boolean') {
      where.read = filters.read;
    }

    if (filters?.search) {
      const like = `%${filters.search}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: like } },
        { email: { [Op.iLike]: like } },
        { subject: { [Op.iLike]: like } }
      ];
    }

    const offset = (page - 1) * pageSize;
    const { rows, count } = await ContactMessageModel.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [['created_at', 'DESC']]
    });

    const items = rows.map((row: any) => new ContactMessage({
      id: row.id,
      subject: row.subject,
      email: row.email,
      name: row.name,
      message: row.message,
      acceptPolicy: row.acceptPolicy,
      allowContact: row.allowContact,
      read: row.read,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));

    return {
      items,
      total: count,
      page,
      pageSize
    };
  }

  async findById(id: string): Promise<ContactMessage | null> {
    const row: any = await ContactMessageModel.findByPk(id);
    if (!row) return null;
    return new ContactMessage({
      id: row.id,
      subject: row.subject,
      email: row.email,
      name: row.name,
      message: row.message,
      acceptPolicy: row.acceptPolicy,
      allowContact: row.allowContact,
      read: row.read,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ContactMessageModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async markRead(id: string, read: boolean): Promise<boolean> {
    const [updated] = await ContactMessageModel.update({ read }, { where: { id } });
    return updated > 0;
  }
}


