import { IEventRepository } from "@domain/repositories/IEventRepository";
import { Event } from "@domain/entities/Event";
import { EventModel } from "../models/Event.model";

export class SequelizeEventRepository implements IEventRepository {
  async create(name: string, description: string, startAt: Date, endAt: Date): Promise<Event> {
    const p = await EventModel.create({ name, description, startAt, endAt });
    return new Event(p.toJSON());
  }

  async list(): Promise<Event[]> {
    const all = await EventModel.findAll();
    return all.map(p => new Event(p.toJSON()));
  }

  async delete(id: string): Promise<void> {
    await EventModel.destroy({ where: { id: id } });
  }
}