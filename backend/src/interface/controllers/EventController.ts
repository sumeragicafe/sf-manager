import { Request, Response } from 'express';

import { createEvent } from '@usecases/Event/createEvent';
import { listEvents } from '@usecases/Event/listEvents';
import { deleteEvent } from '@usecases/Event/deleteEvent';
import { SequelizeEventRepository } from '@infra/sequelize/repositories/SequelizeEventRepository';

const eventRepository = new SequelizeEventRepository();

export class EventController {
  static async create(req: Request, res: Response) {
    try {
      const { name, description, place, start_at, end_at } = req.body;

      const requiredFields = { name, start_at, end_at };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
          res.status(400).json({ message: `Campo obrigatório: ${field}` });
          return;
        }
      }

      const event = await createEvent(eventRepository)(name, description, place, start_at, end_at);
      res.status(201).json(event);

    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    } finally {
      return;
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const events = await listEvents(eventRepository)();
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar eventos' });
    } finally {
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ message: 'ID do evento é obrigatório' });
        return;
      }

      await deleteEvent(eventRepository)(id);
      res.status(200).json({ message: 'Evento deletada com sucesso' });

    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }finally{
      return;
    }
  }
}
