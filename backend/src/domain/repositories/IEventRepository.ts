import { Event } from '@domain/entities/Event';

export interface IEventRepository {
  create(name: string, description: string, place: string, start_at: Date, end_at: Date): Promise<Event>;
  list(): Promise<Event[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<{ name: string; description: string; place: string; start_at: Date; end_at: Date; }>): Promise<Event>;
}