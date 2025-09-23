import { ContactMessage } from '@domain/entities/ContactMessage';
import { IContactMessageRepository } from '@domain/repositories/IContactMessageRepository';

export function createContactMessage(contactRepo: IContactMessageRepository) {
  return async (input: {
    subject: string;
    email: string;
    name: string;
    message: string;
    acceptPolicy: boolean;
    allowContact?: boolean;
  }) => {
    const entity = ContactMessage.createNew(input);
    return await contactRepo.create(entity);
  };
}


