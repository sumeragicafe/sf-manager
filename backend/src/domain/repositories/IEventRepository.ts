import { Event } from '@domain/entities/Event';

export interface IEventRepository {
  create(name: string, description: string, startAt: Date, endAt: Date): Promise<Event>;
  list(): Promise<Event[]>;
  delete(id: string): Promise<void>;
}