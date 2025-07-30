import { IEventRepository } from '@domain/repositories/IEventRepository';

export function deleteEvent(eventRepository: IEventRepository) {
  return async (id: string) => {
    const all = await eventRepository.list();
    const exists = all.find(p => p.props.id === id);
    
    if (!exists) {
      throw new Error('Evento não encontrado');
    }

    await eventRepository.delete(id);
  };
}
