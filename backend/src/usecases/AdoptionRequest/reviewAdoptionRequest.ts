import { IAdoptionRequestRepository } from '@domain/repositories/IAdoptionRequestRepository';
import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { AdoptionRequest } from '@domain/entities/AdoptionRequest';

interface ReviewAdoptionRequestInput {
    adoptionRequestId: string;
    action: 'approve' | 'reject';
    reviewedBy: string; // userId
    notes?: string;
}

export const reviewAdoptionRequest = (
    adoptionRequestRepository: IAdoptionRequestRepository,
    animalRepository: IAnimalRepository
) => async (input: ReviewAdoptionRequestInput): Promise<AdoptionRequest> => {
    // Find adoption request
    const adoptionRequest = await adoptionRequestRepository.findById(input.adoptionRequestId);
    if (!adoptionRequest) {
        throw new Error('Pedido de adoção não encontrado.');
    }

    if (!adoptionRequest.isPending) {
        throw new Error('Este pedido de adoção já foi revisado.');
    }

    // Perform the action
    if (input.action === 'approve') {
        adoptionRequest.approve(input.reviewedBy, input.notes);
        
        // Mark animal as adopted
        await animalRepository.markAsAdopted(adoptionRequest.props.animalId);
    } else {
        adoptionRequest.reject(input.reviewedBy, input.notes);
    }

    // Update adoption request
    const updatedRequest = await adoptionRequestRepository.update(
        input.adoptionRequestId,
        adoptionRequest
    );

    if (!updatedRequest) {
        throw new Error('Erro ao atualizar pedido de adoção.');
    }

    return updatedRequest;
}; 