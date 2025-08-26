import { AnimalMediaProps } from '@domain/entities/AnimalMedia';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IAnimalMediaRepository {
  findById(id: string): Promise<AnimalMediaProps | null>;
  create(data: Omit<AnimalMediaProps, 'id'>): Promise<AnimalMediaProps>;
  update(id: string, data: Partial<Omit<AnimalMediaProps, 'id'>>): Promise<AnimalMediaProps | null>;
  delete(id: string): Promise<boolean>;
  findByPet(petId: string, pagination?: PaginationOptions): Promise<PaginatedResult<AnimalMediaProps>>;
}