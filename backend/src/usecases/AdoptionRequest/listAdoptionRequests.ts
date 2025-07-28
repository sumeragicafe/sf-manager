import { IAdoptionRequestRepository } from '@domain/repositories/IAdoptionRequestRepository';
import { AdoptionRequest } from '@domain/entities/AdoptionRequest';

interface ListAdoptionRequestsFilters {
    status?: string;
    animalId?: string;
}

export const listAdoptionRequests = (
    adoptionRequestRepository: IAdoptionRequestRepository
) => async (filters?: ListAdoptionRequestsFilters): Promise<AdoptionRequest[]> => {
    if (filters?.status) {
        return await adoptionRequestRepository.findByStatus(filters.status);
    }

    if (filters?.animalId) {
        return await adoptionRequestRepository.findByAnimalId(filters.animalId);
    }

    return await adoptionRequestRepository.findAll();
}; 