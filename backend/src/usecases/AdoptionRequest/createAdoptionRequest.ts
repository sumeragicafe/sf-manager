import { IAdoptionRequestRepository } from '@domain/repositories/IAdoptionRequestRepository';
import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AdoptionRequest } from '@domain/entities/AdoptionRequest';

interface CreateAdoptionRequestInput {
    responsibleName: string;
    contactPhone: string;
    animalId: string;
    termsAccepted: boolean;
}

export function createAdoptionRequest(adoptionRequestRepository: IAdoptionRequestRepository, animalRepository: IAnimalRepository){
    return async function (input: CreateAdoptionRequestInput):Promise<AdoptionRequest>{
         // Validate animal exists and is available
        const animal = await animalRepository.findById(input.animalId);
        if (!animal) {
            throw new Error('Animal não encontrado.');
        }

        if (!animal.props.isAvailable) {
            throw new Error('Este animal não está mais disponível para adoção.');
        }

        // Clean phone number (remove formatting)
        const cleanPhone = input.contactPhone.replace(/\D/g, '');

        // Create adoption request
        const adoptionRequest = AdoptionRequest.createNew({
            responsibleName: input.responsibleName.trim(),
            contactPhone: cleanPhone,
            animalId: input.animalId,
            termsAccepted: input.termsAccepted
        });

        // Save to repository
        const createdAdoptionRequest = await adoptionRequestRepository.create(adoptionRequest);

        return createdAdoptionRequest;
    }

};