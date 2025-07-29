import { IEventRepository } from '@domain/repositories/IEventRepository';

export function createEvent(eventRepository: IEventRepository) {
  return async (name: string, description: string, startAt: Date, endAt: Date) => {
    const existingPermissions = await eventRepository.list();
    const exists = existingPermissions.some(p => p.props.name === name);

    if (exists) {
      throw new Error('Evento já existe.');
    }

    try {
      return await eventRepository.create(name, description, startAt, endAt);
    } catch (error: any) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }
  };
}
