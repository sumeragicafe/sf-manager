import { ContactMessage } from '@domain/entities/ContactMessage';
import type { PaginatedResult, PaginationOptions } from '../../types/Pagination';

export interface ContactMessageFilters {
  search?: string; // by name, email, subject
  read?: boolean;
}

export interface IContactMessageRepository {
  create(message: ContactMessage): Promise<ContactMessage>;
  list(options: PaginationOptions, filters?: ContactMessageFilters): Promise<PaginatedResult<ContactMessage>>;
  findById(id: string): Promise<ContactMessage | null>;
  delete(id: string): Promise<boolean>;
  markRead(id: string, read: boolean): Promise<boolean>; // returns updated
}


