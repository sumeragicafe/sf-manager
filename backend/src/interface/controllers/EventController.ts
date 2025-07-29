import { Request, Response } from 'express';

import { createEvent } from '@usecases/Event/createEvent';
import { listEvents } from '@usecases/Event/listEvents';
import { deleteEvent } from '@usecases/Event/deleteEvent';
import { SequelizeEventRepository } from '@infra/sequelize/repositories/SequelizeEventRepository';

const eventRepository = new SequelizeEventRepository();

export class EventController {
  static async create(req: Request, res: Response) {
    try {
      const { name, description, startAt, endAt } = req.body;

      // todo, tem um jeito melhor (biblioteca) de descrever quais campos tem que vim, o tamanho etc
      if (!name || !description || !startAt || !endAt) {
        return res.status(400).json({ message: 'Campo obrigatório' });
      }

      const event = await createEvent(eventRepository)(name, description, startAt, endAt);
      return res.status(201).json(event);

    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const events = await listEvents(eventRepository)();
      return res.json(events);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID do evento é obrigatório' });
      }

      await deleteEvent(eventRepository)(id);
      return res.status(200).json({ message: 'Evento deletada com sucesso' });

    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
}
