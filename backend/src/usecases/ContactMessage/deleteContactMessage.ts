import { IContactMessageRepository } from '@domain/repositories/IContactMessageRepository';

export function deleteContactMessage(contactRepo: IContactMessageRepository) {
  return async (id: string) => {
    const ok = await contactRepo.delete(id);
    if (!ok) throw new Error('Mensagem não encontrada');
    return ok;
  };
}


