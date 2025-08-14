// import { Animal } from '@domain/entities/Animal';

// export interface IAnimalRepository {
//     create(animal: Animal): Promise<Animal>;
//     findById(id: string): Promise<Animal | null>;
//     findAll(): Promise<Animal[]>;
//     findAvailableForAdoption(): Promise<Animal[]>;
//     update(id: string, animal: Partial<Animal>): Promise<Animal | null>;
//     delete(id: string): Promise<boolean>;
//     markAsAdopted(id: string): Promise<boolean>;
//     markAsAvailable(id: string): Promise<boolean>;
// } 
import { AnimalProps, Animal } from '@domain/entities/Animal';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';

export interface IAnimalRepository {
  findById(id: string): Promise<Animal | null>;
  searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<Animal>>;
  create(data: Omit<AnimalProps, 'id'>): Promise<Animal>;
  update(id: string, data: Partial<Omit<AnimalProps, 'id'>>): Promise<Animal | null>;
  delete(id: string): Promise<boolean>;
  findAll(pagination?: PaginationOptions): Promise<PaginatedResult<Animal>>;
}