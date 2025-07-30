import { IEventRepository } from '@domain/repositories/IEventRepository';

export function createEvent(eventRepository: IEventRepository) {
  return async (
    name: string,
    description: string,
    place: string,
    start_at: Date,
    end_at: Date
  ) => {
    const now = new Date();

    if (start_at < now) {
      throw new Error('A data de início do evento não pode ser no passado.');
    }

    if (end_at <= start_at) {
      throw new Error('A data de término do evento deve ser posterior à data de início.');
    }

    try {
      return await eventRepository.create(name, description, place, start_at, end_at);
    } catch (error: any) {
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }
  };
}