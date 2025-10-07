import { IContactMessageRepository } from '@domain/repositories/IContactMessageRepository';

export function markContactMessageRead(contactRepo: IContactMessageRepository) {
  return async (id: string, read: boolean) => {
    const ok = await contactRepo.markRead(id, read);
    if (!ok) throw new Error('Mensagem não encontrada');
    return ok;
  };
}


