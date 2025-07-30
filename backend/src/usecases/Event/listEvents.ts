import { IEventRepository } from '@domain/repositories/IEventRepository';
export function listEvents(eventRepository: IEventRepository) {
  return async () => {
    return await eventRepository.list();
  };
}
