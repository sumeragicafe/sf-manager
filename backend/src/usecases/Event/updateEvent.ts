import { IEventRepository } from '@domain/repositories/IEventRepository';

export function updateEvent(eventRepository: IEventRepository) {
  return async (
    id: string,
    data: Partial<{ name: string; description: string; place: string; start_at: Date; end_at: Date; }>
  ) => {
    if (data.start_at && data.end_at && data.end_at <= data.start_at) {
      throw new Error('A data de término do evento deve ser posterior à data de início.');
    }
    return await eventRepository.update(id, data);
  };
}


