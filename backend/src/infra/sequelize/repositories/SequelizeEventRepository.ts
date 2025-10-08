import { IEventRepository } from "@domain/repositories/IEventRepository";
import { Event } from "@domain/entities/Event";
import { EventModel } from "@infra/sequelize/models/Event.model";

export class SequelizeEventRepository implements IEventRepository {
  async create(name: string, description: string, place: string, start_at: Date, end_at: Date): Promise<Event> {
    const p = await EventModel.create({ name, description, place, start_at, end_at });
    return new Event(p.toJSON());
  }

  async list(): Promise<Event[]> {
    const all = await EventModel.findAll();
    return all.map(p => new Event(p.toJSON()));
  }

  async delete(id: string): Promise<void> {
    await EventModel.destroy({ where: { id: id } });
  }

  async update(id: string, data: Partial<{ name: string; description: string; place: string; start_at: Date; end_at: Date; }>): Promise<Event> {
    const instance = await EventModel.findByPk(id);
    if (!instance) {
      throw new Error('Evento não encontrado');
    }
    await instance.update(data as any);
    return new Event(instance.toJSON());
  }
}