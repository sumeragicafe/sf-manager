import { AnimalFactProps } from '@domain/entities/AnimalFact';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IAnimalFactRepository {
  findById(id: string): Promise<AnimalFactProps | null>;
  create(data: Omit<AnimalFactProps, 'id'>): Promise<AnimalFactProps>;
  update(id: string, data: Partial<Omit<AnimalFactProps, 'id'>>): Promise<AnimalFactProps | null>;
  delete(id: string): Promise<boolean>;
  findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalFactProps>>;
}