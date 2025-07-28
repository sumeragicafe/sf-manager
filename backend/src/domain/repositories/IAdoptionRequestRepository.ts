import { AdoptionRequest } from '@domain/entities/AdoptionRequest';

export interface IAdoptionRequestRepository {
    create(adoptionRequest: AdoptionRequest): Promise<AdoptionRequest>;
    findById(id: string): Promise<AdoptionRequest | null>;
    findAll(): Promise<AdoptionRequest[]>;
    findByAnimalId(animalId: string): Promise<AdoptionRequest[]>;
    findByStatus(status: string): Promise<AdoptionRequest[]>;
    update(id: string, adoptionRequest: Partial<AdoptionRequest>): Promise<AdoptionRequest | null>;
    delete(id: string): Promise<boolean>;
} 