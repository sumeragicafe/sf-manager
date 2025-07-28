import { Animal } from '@domain/entities/Animal';

export interface IAnimalRepository {
    create(animal: Animal): Promise<Animal>;
    findById(id: string): Promise<Animal | null>;
    findAll(): Promise<Animal[]>;
    findAvailableForAdoption(): Promise<Animal[]>;
    update(id: string, animal: Partial<Animal>): Promise<Animal | null>;
    delete(id: string): Promise<boolean>;
    markAsAdopted(id: string): Promise<boolean>;
    markAsAvailable(id: string): Promise<boolean>;
} 