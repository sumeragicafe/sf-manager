import { Request, Response } from 'express';
import { SequelizeContactMessageRepository } from '@infra/sequelize/repositories/SequelizeContactMessageRepository';
import { createContactMessage } from '@usecases/ContactMessage/createContactMessage';
import { listContactMessages } from '@usecases/ContactMessage/listContactMessages';
import { deleteContactMessage } from '@usecases/ContactMessage/deleteContactMessage';
import { markContactMessageRead } from '@usecases/ContactMessage/markContactMessageRead';

const contactRepo = new SequelizeContactMessageRepository();

export class ContactMessageController {
  static async create(req: Request, res: Response) {
    try {
      const { subject, email, name, message, acceptPolicy, allowContact } = req.body;
      const created = await createContactMessage(contactRepo)({
        subject,
        email,
        name,
        message,
        acceptPolicy,
        allowContact
      });
      return res.status(201).json({
        id: created.props.id,
        message: 'Mensagem enviada com sucesso!'
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
      const search = (req.query.search as string) || undefined;
      const readParam = req.query.read as string | undefined;
      const read = typeof readParam !== 'undefined' ? readParam === 'true' : undefined;

      const result = await listContactMessages(contactRepo)({ page, pageSize }, { search, read });
      return res.json({
        items: result.items.map(i => ({
          id: i.props.id,
          subject: i.props.subject,
          email: i.props.email,
          name: i.props.name,
          message: i.props.message,
          read: !!i.props.read,
          createdAt: i.props.createdAt
        })),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteContactMessage(contactRepo)(id);
      return res.json({ message: 'Mensagem deletada com sucesso!' });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { read } = req.body as { read: boolean };
      await markContactMessageRead(contactRepo)(id, !!read);
      return res.json({ message: 'Status atualizado com sucesso!' });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}


